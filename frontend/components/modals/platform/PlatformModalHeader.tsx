import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { SegmentControl, type SegmentOption } from '../../ui/SegmentControl';
import {
  UNIFORM_HEADER_BUTTON_CLASS,
  UNIFORM_HEADER_ICON_BUTTON_CLASS,
} from '../../../utils/ui/uiConstants';

export type PlatformMethod = 'credentials' | 'apiKey' | 'csv';

export interface PlatformModalHeaderProps<T extends string = string> {
  onBack?: () => void;
  onClose?: () => void;
  intent: 'initial' | 'update';
  segments: readonly SegmentOption<T>[];
  activeSegment: T;
  onSegmentChange: (value: T) => void;
}

export function PlatformModalHeader<T extends string = string>({
  onBack,
  onClose,
  intent,
  segments,
  activeSegment,
  onSegmentChange,
}: PlatformModalHeaderProps<T>): React.ReactElement {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center w-full">
        <div className="w-[72px]">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className={UNIFORM_HEADER_ICON_BUTTON_CLASS}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        <div className="flex-1" />

        <div className="w-[72px] flex justify-end">
          {intent === 'update' && onClose ? (
            <button
              type="button"
              onClick={onClose}
              className={UNIFORM_HEADER_BUTTON_CLASS}
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex justify-center">
        <SegmentControl
          options={segments}
          value={activeSegment}
          onChange={onSegmentChange}
        />
      </div>
    </div>
  );
}

export default PlatformModalHeader;
