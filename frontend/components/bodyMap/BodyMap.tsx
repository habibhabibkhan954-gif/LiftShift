import React, { useLayoutEffect, useRef, useCallback, useMemo, useEffect } from 'react';
import gsap from 'gsap';
import { getVolumeColor, getExerciseMuscleColor, getHypertrophyColor, SVG_MUSCLE_GROUPS, CSV_TO_SVG_MUSCLE_MAP, getMuscleIdForDetailedSvgId } from '../../utils/muscle/mapping';
import { INTERACTIVE_MUSCLE_IDS } from '../../utils/muscle/mapping';
import { getMuscleWithFallback } from '../../utils/muscle/mapping/bodyMapAvailability';
import type { MuscleVolumeThresholds } from '../../utils/muscle/hypertrophy/muscleParams';
import MaleFrontBodyMapMuscle from './muscles/MaleFrontBodyMapMuscle';
import MaleBackBodyMapMuscle from './muscles/MaleBackBodyMapMuscle';
import MaleFrontBodyMapGroup from './groups/MaleFrontBodyMapGroup';
import MaleBackBodyMapGroup from './groups/MaleBackBodyMapGroup';
import DemoFrontBodyMapGroup from './demo/DemoFrontBodyMapGroup';
import DemoBackBodyMapGroup from './demo/DemoBackBodyMapGroup';
import FemaleFrontBodyMapMuscle from './muscles/FemaleFrontBodyMapMuscle';
import FemaleBackBodyMapMuscle from './muscles/FemaleBackBodyMapMuscle';
import FemaleFrontBodyMapGroup from './groups/FemaleFrontBodyMapGroup';
import FemaleBackBodyMapGroup from './groups/FemaleBackBodyMapGroup';
import type { BodyWarpParams } from '../../hooks/useBodyMapWarp';
import type { BodyMapStrokeConfig } from '../../config/bodyMapWarp';

export type BodyMapGender = 'male' | 'female';
export type BodyMapVariant = 'original' | 'demo';

interface BodyMapProps {
  onPartClick: (muscleGroup: string) => void;
  selectedPart: string | null;
  selectedMuscleIdsOverride?: string[];
  hoveredMuscleIdsOverride?: string[];
  muscleVolumes: Map<string, number>;
  maxVolume?: number;
  volumeThresholds?: MuscleVolumeThresholds;
  useExerciseColors?: boolean;
  useHypertrophyColors?: boolean;
  onPartHover?: (muscleGroup: string | null, e?: MouseEvent) => void;
  compact?: boolean;
  compactFill?: boolean;
  interactive?: boolean;
  gender?: BodyMapGender;
  variant?: BodyMapVariant;
  warpParams?: BodyWarpParams;
  stroke?: Partial<BodyMapStrokeConfig>;
  viewMode?: 'original' | 'headless';
}

// Hover and selection highlight colors (theme-driven)
const HOVER_HIGHLIGHT = 'rgb(var(--bodymap-hover-rgb) / 1)';
const SELECTION_HIGHLIGHT = 'rgb(var(--bodymap-selection-rgb) / 1)';

const INTERACTIVE_MUSCLES: readonly string[] = INTERACTIVE_MUSCLE_IDS;

export const getRelatedMuscleIds = (muscleGroup: string | null): string[] => {
  if (!muscleGroup) return [];
  const groupName = SVG_MUSCLE_GROUPS[muscleGroup];
  if (!groupName) {
    const capitalized = muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1);
    const direct = CSV_TO_SVG_MUSCLE_MAP[muscleGroup] ?? CSV_TO_SVG_MUSCLE_MAP[capitalized];
    return direct ?? [muscleGroup];
  }
  const relatedIds = new Set<string>();
  relatedIds.add(muscleGroup);
  const csvEntry = CSV_TO_SVG_MUSCLE_MAP[groupName];
  if (csvEntry) {
    csvEntry.forEach(id => relatedIds.add(id));
  }
  for (const [svgId, grp] of Object.entries(SVG_MUSCLE_GROUPS)) {
    if (grp === groupName) relatedIds.add(svgId);
  }
  return Array.from(relatedIds);
};

export const BodyMap: React.FC<BodyMapProps> = ({
  onPartClick,
  selectedPart,
  selectedMuscleIdsOverride,
  hoveredMuscleIdsOverride,
  muscleVolumes,
  maxVolume = 1,
  volumeThresholds,
  useExerciseColors = false,
  useHypertrophyColors = false,
  onPartHover,
  compact = false,
  compactFill = false,
  interactive = false,
  gender = 'male',
  variant = 'demo',
  warpParams = undefined,
  stroke = undefined,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoveredMuscleRef = useRef<string | null>(null);
  const selectedMuscleIds = useMemo(
    () => selectedMuscleIdsOverride
      ? selectedMuscleIdsOverride.flatMap(id => getRelatedMuscleIds(id))
      : getRelatedMuscleIds(selectedPart),
    [selectedMuscleIdsOverride, selectedPart]
  );

  const effectiveGender: BodyMapGender = (gender ?? 'male') as BodyMapGender;
  const effectiveVariant: BodyMapVariant = (variant ?? 'demo') as BodyMapVariant;

  const applyColors = useCallback((hoveredId: string | null = null) => {
    if (!containerRef.current) return;
    INTERACTIVE_MUSCLES.forEach(muscleId => {
      const targetId = getMuscleWithFallback(muscleId, effectiveVariant, effectiveGender);
      const elements = containerRef.current?.querySelectorAll(`#${targetId}`);
      const isOriginalSelection = muscleId !== targetId;
      elements?.forEach(el => {
        const headlessId = getMuscleIdForDetailedSvgId(muscleId) ?? muscleId;
        const volume = muscleVolumes.get(muscleId) ?? muscleVolumes.get(headlessId) ?? 0;
        const color = useExerciseColors
          ? getExerciseMuscleColor(volume)
          : useHypertrophyColors
            ? getHypertrophyColor(volume)
            : getVolumeColor(volume, volumeThresholds, maxVolume);
        const isSelected = selectedMuscleIds.includes(muscleId) || (isOriginalSelection && selectedMuscleIds.includes(targetId));
        const isHovered = hoveredMuscleIdsOverride
          ? hoveredMuscleIdsOverride.some(id => getRelatedMuscleIds(id).includes(muscleId))
          : (hoveredId === muscleId || (hoveredId && getRelatedMuscleIds(hoveredId).includes(muscleId)));

        let finalColor = color;
        let finalFilter = '';

        if (isSelected) {
          finalColor = SELECTION_HIGHLIGHT;
          finalFilter = 'brightness(1.15) url(#muscle-glow)';
        } else if (isHovered) {
          finalColor = HOVER_HIGHLIGHT;
          finalFilter = 'brightness(1.1) url(#muscle-glow-subtle)';
        }

        el.querySelectorAll('path').forEach(path => {
          // Use GSAP for smooth transition
          gsap.to(path, {
            fill: finalColor,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto'
          });
          
          path.style.filter = finalFilter;

          // Add pulsing effect for highly active muscles
          if (volume > (maxVolume * 0.7) && !compact) {
             gsap.to(path, {
               opacity: 0.7,
               repeat: -1,
               yoyo: true,
               duration: 0.8 + Math.random() * 0.4,
               ease: 'sine.inOut'
             });
          } else {
             gsap.to(path, { opacity: 1, duration: 0.3, overwrite: 'auto' });
          }
        });
        (el as HTMLElement).style.cursor = compact && !interactive ? 'default' : 'pointer';
      });
    });
  }, [muscleVolumes, maxVolume, selectedMuscleIds, hoveredMuscleIdsOverride, interactive, useExerciseColors, useHypertrophyColors, volumeThresholds, effectiveVariant, effectiveGender, compact]);

  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as Element;
    const muscleGroup = target.closest('g[id]');
    if (muscleGroup && INTERACTIVE_MUSCLES.includes(muscleGroup.id)) {
      const targetId = getMuscleWithFallback(muscleGroup.id, effectiveVariant, effectiveGender);
      onPartClick(targetId);
    }
  }, [onPartClick, effectiveVariant, effectiveGender]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as Element;
    const muscleGroup = target.closest('g[id]');
    if (muscleGroup && INTERACTIVE_MUSCLES.includes(muscleGroup.id)) {
      const hoveredId = muscleGroup.id;
      hoveredMuscleRef.current = hoveredId;
      // If hover ids are controlled externally (e.g. group view), let parent drive highlighting.
      if (!hoveredMuscleIdsOverride) {
        applyColors(hoveredId);
      }
      onPartHover?.(hoveredId, e);
    }
  }, [onPartHover, applyColors, hoveredMuscleIdsOverride]);

  const handleMouseOut = useCallback((e: MouseEvent) => {
    hoveredMuscleRef.current = null;
    if (!hoveredMuscleIdsOverride) {
      applyColors(null);
    }
    onPartHover?.(null, e);
  }, [onPartHover, applyColors, hoveredMuscleIdsOverride]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      applyColors(hoveredMuscleRef.current);
    }, containerRef);

    const container = containerRef.current;
    if (!container) return () => ctx.revert();

    // Skip event listeners for compact (mini) body maps - no interaction
    if (compact && !interactive) return () => ctx.revert();

    container.addEventListener('click', handleClick);
    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', handleMouseOut);

    return () => {
      ctx.revert();
      container.removeEventListener('click', handleClick);
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', handleMouseOut);
    };
  }, [applyColors, handleClick, handleMouseOver, handleMouseOut, compact, interactive]);

  const svgClass = compact 
    ? (compactFill ? 'h-full w-auto' : 'h-28 w-auto') 
    : 'h-[45vh] sm:h-[50vh] md:h-[55vh] lg:h-[60vh] xl:h-[65vh] 2xl:max-h-[55vh] w-auto max-h-[500px]';

  const isDemoVariant = variant === 'demo' && gender === 'male';
  
  const FrontSvg = isDemoVariant
    ? DemoFrontBodyMapGroup
    : (gender === 'female' 
      ? FemaleFrontBodyMapGroup
      : MaleFrontBodyMapGroup);
  
  const BackSvg = isDemoVariant
    ? DemoBackBodyMapGroup
    : (gender === 'female'
      ? FemaleBackBodyMapGroup
      : MaleBackBodyMapGroup);

  useEffect(() => {
    if ((compact && !interactive) || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const factor = compact ? 40 : 20;
        const rotateX = (y - centerY) / factor;
        const rotateY = (centerX - x) / factor;

        gsap.to(container, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.5,
          ease: 'power2.out'
        });
      };

      const handleMouseLeave = () => {
        gsap.to(container, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      };

      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }, containerRef);

    return () => ctx.revert();
  }, [compact, interactive]);

  useEffect(() => {
    if (!containerRef.current || compact) return;

    const ctx = gsap.context(() => {
      const muscles = containerRef.current?.querySelectorAll('g[id]');
      if (muscles) {
        gsap.fromTo(muscles,
          { opacity: 0, scale: 0.9, y: 10 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            stagger: {
              each: 0.015,
              from: "center"
            },
            ease: 'back.out(1.4)',
            clearProps: 'all'
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [compact]);

  return (
    <div
      ref={containerRef}
      className={`body-map-container flex justify-center items-center ${compact ? 'gap-0' : 'gap-4'} w-full ${compactFill ? 'h-full' : ''}`}
      style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
    >
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="muscle-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="rgb(var(--bodymap-selection-rgb))" floodOpacity="0.5" result="glowColor" />
            <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="muscle-glow-subtle" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feFlood floodColor="rgb(var(--bodymap-hover-rgb))" floodOpacity="0.3" result="glowColor" />
            <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <FrontSvg className={svgClass} warpOverrides={warpParams} stroke={stroke} />
      <BackSvg className={svgClass} warpOverrides={warpParams} stroke={stroke} />
    </div>
  );
};
