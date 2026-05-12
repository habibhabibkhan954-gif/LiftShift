import type { SetCommentaryOptions } from './setCommentaryLibrary';
import type { SetTypeId } from './setTypeConfig';

export type SetTypeScenario = `${SetTypeId}|${string}`;

export const DROPSET_WEIGHT_DECREASE_MET: SetCommentaryOptions = {
  shortMessages: [
    'Drop Set Executed',
    'Good Drop Set',
    'Drop Volume In',
    'Intentional Drop',
    'Extended Set Done',
    'Burnout Complete',
    'Deep Set Work',
    'Drop Set Success',
  ] as const,
  tooltips: [
    '{reps} reps after drop set',
    'Drop set: {reps} reps recovered',
    'Planned drop: {reps} reps',
    'Drop set volume: {reps}',
    'Intensity technique: {reps}',
    'Good drop set output: {reps}',
  ] as const,
  whyLines: [
    'Drop set is a planned intensity technique',
    'Weight drop allowed continued work past failure',
    'Deliberate reduction to extend the set',
    'Muscle fatigue was pushed further intentionally',
    'Good execution of the drop set protocol',
  ] as const,
  improveLines: [
    'Drop sets are demanding, manage recovery',
    'Limit to 1-2 drop sets per exercise per session',
    'Use drop sets on your last working set',
    'Keep form strict as fatigue builds',
  ] as const,
};

export const DROPSET_WEIGHT_DECREASE_SLIGHTLY_BELOW: SetCommentaryOptions = {
  shortMessages: [
    'Drop Set Heavy',
    'Deep Fatigue',
    'Drop Took It Out',
    'Burned Out',
    'Extended Effort',
    'Deep Burn',
  ] as const,
  tooltips: [
    '{reps} reps after drop set (target {target})',
    'Drop set: {reps} reps, deep fatigue',
    'Extended set demand high: {reps}',
    'Drop set output limited by fatigue: {reps}',
  ] as const,
  whyLines: [
    'Drop set extends the set past normal failure',
    'Accumulated fatigue reduces rep output',
    'The extended set demand is very high',
    'This is expected with drop set intensity',
  ] as const,
  improveLines: [
    'Consider a larger weight drop next time',
    'Rest a few seconds before starting the drop',
    'Stop the drop set if form breaks down',
  ] as const,
};

export const DROPSET_WEIGHT_DECREASE_SIGNIFICANTLY_BELOW: SetCommentaryOptions = {
  shortMessages: [
    'Drop Set Maxed',
    'Full Burnout',
    'Deep Drop Set',
    'Completely Fried',
    'Drop Exhaustion',
    'Set Extended to Limit',
  ] as const,
  tooltips: [
    '{reps} reps after drop set (target {target})',
    'Drop set reached deep fatigue: {reps}',
    'Significant fatigue from drop set: {reps}',
    'Maximum effort drop set output: {reps}',
  ] as const,
  whyLines: [
    'Drop set pushed well past normal failure',
    'Extreme fatigue accumulated across the extended set',
    'This is the intended outcome of a deep drop set',
    'The extended effort heavily taxed the muscle',
  ] as const,
  improveLines: [
    'Use a lighter initial weight for the drop set',
    'Add more drop steps with smaller reductions',
    'Take a brief pause between drop steps',
  ] as const,
};

export const BACKOFF_WEIGHT_DECREASE_MET: SetCommentaryOptions = {
  shortMessages: [
    'Solid Back-off',
    'Volume Builder',
    'Good Reset',
    'Quality Volume',
    'Back-off Work',
    'Volume Accumulated',
    'Good Reps Back-off',
    'Smart Drop',
  ] as const,
  tooltips: [
    '{reps} reps back-off set',
    'Back-off set: {reps} quality reps',
    'Volume work: {reps} after heavy set',
    'Good reset volume: {reps}',
    'Back-off success: {reps}',
  ] as const,
  whyLines: [
    'Back-off set provides volume after the heavy top set',
    'Weight reduction is planned for technique and volume',
    'Good execution of the back-off protocol',
    'Volume accumulation at slightly lower intensity',
  ] as const,
  improveLines: [
    'Use back-off sets for 8-12 quality reps',
    'Keep rest 2-3 minutes after the top set',
    'Focus on clean technique during back-off work',
  ] as const,
};

export const BACKOFF_WEIGHT_DECREASE_SLIGHTLY_BELOW: SetCommentaryOptions = {
  shortMessages: [
    'Back-off Heavy',
    'Carry-over Fatigue',
    'Still Feeling Top Set',
    'Back-off Grind',
    'Volume Under Strain',
    'Heavy Legs',
  ] as const,
  tooltips: [
    '{reps} reps back-off (target {target})',
    'Back-off set limited by top set fatigue: {reps}',
    'Carry-over fatigue from heavy set: {reps}',
    'Back-off output reduced: {reps}',
  ] as const,
  whyLines: [
    'Fatigue from the heavy top set carries over',
    'The back-off weight may still be too heavy today',
    'Top set intensity affected volume set output',
    'A slightly larger drop may help rep quality',
  ] as const,
  improveLines: [
    'Drop weight a bit more for back-off sets',
    'Take longer rest after the top set',
    'Reduce the top set RPE to preserve back-off quality',
  ] as const,
};

export const BACKOFF_WEIGHT_DECREASE_SIGNIFICANTLY_BELOW: SetCommentaryOptions = {
  shortMessages: [
    'Back-off Too Heavy',
    'Top Set Drained',
    'Deep Fatigue',
    'Volume Collapse',
    'Back-off Overreached',
    'Top Set Taxed Too Much',
  ] as const,
  tooltips: [
    '{reps} reps back-off (target {target})',
    'Back-off output collapsed: {reps}',
    'Deep fatigue carried from top set: {reps}',
    'Back-off weight needs significant reduction: {reps}',
  ] as const,
  whyLines: [
    'The top set heavily taxed available energy',
    'Back-off weight drop was insufficient for recovery',
    'Session fatigue is limiting productive volume',
    'A larger weight drop is needed for effective back-off sets',
  ] as const,
  improveLines: [
    'Drop 15-20% for back-off sets instead',
    'Consider 1-2 RIR on the top set to preserve output',
    'Reduce back-off set volume if fatigue remains high',
  ] as const,
};

export const TOPSET_WEIGHT_INCREASE_EXCEEDED: SetCommentaryOptions = {
  shortMessages: [
    'Top Set Crushed',
    'Peak Set Done',
    'Heavy Set Handled',
    'Top Set Success',
    'Peak Achieved',
    'Strong Top Set',
    'Heavy Lifted Well',
    'Top Set Dominated',
  ] as const,
  tooltips: [
    'Top set: {reps} reps at +{pct}%',
    'Peak set exceeded: {reps} reps',
    'Heavy top set handled: {reps}',
    'Top set crushed: {reps} reps',
    'Peak output on top set: {reps}',
  ] as const,
  whyLines: [
    'Strength peaked well on this heavy top set',
    'Good neural drive for the heaviest set',
    'Excellent execution of the top set',
    'Peak strength is clearly progressing',
  ] as const,
  improveLines: [
    'Use this top set to set back-off weights',
    'Log how this felt for next session adjustment',
    'Consider adding 2.5kg next top set attempt',
  ] as const,
};

export const TOPSET_WEIGHT_INCREASE_MET: SetCommentaryOptions = {
  shortMessages: [
    'Top Set On Target',
    'Peak Set Hit',
    'Heavy Set Complete',
    'Top Set Executed',
    'Load Met at Peak',
    'Top Set On Plan',
  ] as const,
  tooltips: [
    'Top set: {reps} reps at +{pct}%',
    'Top set target met: {reps}',
    'Heavy set on target: {reps}',
    'Peak set completed: {reps}',
  ] as const,
  whyLines: [
    'Top set weight was appropriate for today',
    'Good peak effort on the heaviest set',
    'Top set target was well chosen',
    'Strength held well at this peak load',
  ] as const,
  improveLines: [
    'Hold this top set weight next session',
    'Try to add one rep before increasing',
    'Use this to anchor back-off set weights',
  ] as const,
};

export const FAILURE_SAME_WEIGHT_REPS_INCREASED: SetCommentaryOptions = {
  shortMessages: [
    'All Out',
    'Max Effort',
    'Gave It All',
    'Failure Pushed',
    'Max Output',
    'Limit Found and Pushed',
    'Full Effort',
    'Pushed to the End',
  ] as const,
  tooltips: [
    '+{diff} reps in failure set',
    'Pushed to failure: +{diff}',
    'Max effort set: +{diff} reps',
    'Failure set: {diff} more reps than last',
  ] as const,
  whyLines: [
    'Going to failure maximized rep output',
    'Failure set recruits all motor units',
    'Maximal effort produced extra reps',
    'Pushing to failure found hidden capacity',
  ] as const,
  improveLines: [
    'Use failure sets sparingly to manage recovery',
    'Limit failure sets to the last set of each exercise',
    'Track recovery carefully after failure training',
  ] as const,
};

export const FAILURE_SAME_WEIGHT_REPS_SAME: SetCommentaryOptions = {
  shortMessages: [
    'At Failure Point',
    'Maxed on Reps',
    'Failure Reached',
    'Limit Met',
    'All Given',
    'Failure Achieved',
  ] as const,
  tooltips: [
    'Failure set: {reps} reps',
    'Reached failure at {reps}',
    'Max effort: {reps} at failure',
    'Failure point at {reps} reps',
  ] as const,
  whyLines: [
    'Failure was reached at the expected point',
    'Consistent output at maximal effort',
    'Good execution of a failure set',
    'Failure point is well established at this load',
  ] as const,
  improveLines: [
    'Failure training is demanding, manage volume',
    'Consider stopping 1 rep short on most sets',
    'Use failure selectively for specific goals',
  ] as const,
};

export const FAILURE_SAME_WEIGHT_DROP: SetCommentaryOptions = {
  shortMessages: [
    'Failure to Failure',
    'Deep Fatigue',
    'Second Failure Hit Hard',
    'Cumulative Exhaustion',
    'Fatigue Stacked',
    'Back-to-Back Failure',
    'Maxed Then Maxed Again',
    'Double Failure',
  ] as const,
  tooltips: [
    '-{dropAbs} reps in failure set',
    'Failure set drop: -{dropAbs}',
    'Accumulated fatigue: -{dropAbs}',
    'Second failure set limited: -{dropAbs}',
  ] as const,
  whyLines: [
    'Consecutive failure sets accumulate extreme fatigue',
    'The first failure set depleted energy reserves',
    'Cumulative fatigue is expected in failure training',
    'Pushing to failure twice is very demanding',
  ] as const,
  improveLines: [
    'Separate failure sets with adequate rest',
    'Alternate failure sets with normal sets',
    'Use failure on the last set only',
    'Monitor form closely on failure sets',
  ] as const,
};

export const AMRAP_SAME_WEIGHT_REPS_INCREASED: SetCommentaryOptions = {
  shortMessages: [
    'AMRAP Push',
    'Maxed Reps',
    'All Out AMRAP',
    'AMRAP Success',
    'Extra Reps Found',
    'AMRAP Record',
    'Quality AMRAP',
    'Good AMRAP',
  ] as const,
  tooltips: [
    'AMRAP: +{diff} reps vs last',
    'Maxed out AMRAP: +{diff}',
    'AMRAP success: {diff} more reps',
    'Found extra on AMRAP: +{diff}',
  ] as const,
  whyLines: [
    'AMRAP set maximized rep output',
    'All out effort on the AMRAP set',
    'Good pacing across the AMRAP',
    'Fully emptied the tank on this set',
  ] as const,
  improveLines: [
    'AMRAPs are taxing, manage recovery accordingly',
    'Use AMRAPs on the last set for best results',
    'Track rep count to gauge progress',
  ] as const,
};

export const AMRAP_SAME_WEIGHT_REPS_SAME: SetCommentaryOptions = {
  shortMessages: [
    'AMRAP Hit Target',
    'Solid AMRAP',
    'AMRAP Done',
    'Good AMRAP Output',
    'AMRAP Consistent',
    'On Point AMRAP',
  ] as const,
  tooltips: [
    'AMRAP: {reps} reps',
    'Solid AMRAP output: {reps}',
    'AMRAP target hit at {reps}',
    'Consistent AMRAP: {reps}',
  ] as const,
  whyLines: [
    'Consistent AMRAP performance',
    'Good output on the AMRAP set',
    'Pacing held well throughout',
    'Solid all-out effort',
  ] as const,
  improveLines: [
    'Aim for one more rep next AMRAP',
    'Try increasing the weight slightly',
    'Use AMRAP to gauge readiness',
  ] as const,
};

export const AMRAP_SAME_WEIGHT_DROP: SetCommentaryOptions = {
  shortMessages: [
    'AMRAP Fatigue',
    'Deep AMRAP Burn',
    'AMRAP Took Its Toll',
    'Maxed Then Dropped',
    'AMRAP Exhaustion',
    'Second AMRAP Hit Hard',
  ] as const,
  tooltips: [
    'AMRAP drop: -{dropAbs} reps',
    'AMRAP fatigue: -{dropAbs}',
    'Cumulative AMRAP demand: -{dropAbs}',
    'AMRAP exhaustion: -{dropAbs}',
  ] as const,
  whyLines: [
    'AMRAP sets are highly demanding',
    'The first AMRAP depleted available energy',
    'Fatigue from maximal efforts accumulates quickly',
    'This drop is expected with consecutive AMRAPs',
  ] as const,
  improveLines: [
    'Rest longer between AMRAP sets',
    'Limit to one AMRAP per exercise per session',
    'Consider normal sets before attempting another AMRAP',
  ] as const,
};

export const INTENSITY_TECHNIQUE_SAME_WEIGHT_DROP: SetCommentaryOptions = {
  shortMessages: [
    'Technique Push',
    'Intensity Work',
    'Extended Set Fatigue',
    'Rest-Pause Demand',
    'Myo-Reps Tax',
    'Cluster Set Load',
  ] as const,
  tooltips: [
    'Intensity technique: -{dropAbs} reps',
    'Extended set demand: -{dropAbs}',
    'Technique-set fatigue: -{dropAbs}',
    'Normal for intensity techniques: -{dropAbs}',
  ] as const,
  whyLines: [
    'Intensification techniques extend sets past normal failure',
    'The intra-set rest pattern affects rep distribution',
    'This is expected with rest-pause / myo-reps / cluster sets',
    'Accumulated fatigue is inherent to these techniques',
  ] as const,
  improveLines: [
    'Manage intra-set rest periods carefully',
    'Keep total volume in check with these techniques',
    'Use on the last set of an exercise for best results',
  ] as const,
};

export const UNILATERAL_SAME_WEIGHT_REPS_INCREASED: SetCommentaryOptions = {
  shortMessages: [
    'Side Improved',
    'Unilateral Gain',
    'Single Side Up',
    'Side Getting Stronger',
    'Unilateral Progress',
    'One Side Up',
  ] as const,
  tooltips: [
    '+{diff} reps on this side',
    'Side improvement: +{diff}',
    'Unilateral gain: +{diff} reps',
    'This side stronger: +{diff}',
  ] as const,
  whyLines: [
    'Better performance on this unilateral set',
    'Recovery between sides worked well',
    'This side had more energy available',
    'Unilateral work allows focused effort per side',
  ] as const,
  improveLines: [
    'Track left vs right to monitor balance',
    'Start with the weaker side first',
    'Keep reps even across both sides',
  ] as const,
};

export const UNILATERAL_SAME_WEIGHT_DROP: SetCommentaryOptions = {
  shortMessages: [
    'Side Fatigue',
    'Unilateral Drop',
    'Single Side Fading',
    'Side Tiring',
    'Unilateral Exhaustion',
    'One Side Down',
  ] as const,
  tooltips: [
    '-{dropAbs} reps on this side',
    'Side drop: -{dropAbs}',
    'Unilateral fatigue: -{dropAbs}',
    'This side tiring: -{dropAbs}',
  ] as const,
  whyLines: [
    'Fatigue accumulating on this unilateral set',
    'Single-limb work taxes the muscle faster',
    'Unilateral sets have higher per-side fatigue',
    'This side may need more recovery',
  ] as const,
  improveLines: [
    'Rest between sides if needed',
    'Consider reducing weight on this side',
    'Focus on form as fatigue builds',
  ] as const,
};

export const NEGATIVE_SAME_WEIGHT: SetCommentaryOptions = {
  shortMessages: [
    'Negatives Done',
    'Eccentric Work',
    'Negative Reps In',
    'Controlled Negatives',
    'Eccentric Focus',
    'Negatives Complete',
  ] as const,
  tooltips: [
    'Negative set: {reps} reps',
    'Eccentric work: {reps} controlled reps',
    'Negative reps completed: {reps}',
    'Eccentric set: {reps}',
  ] as const,
  whyLines: [
    'Negatives focus on the eccentric phase',
    'Controlled lowering increases time under tension',
    'Eccentric work uses heavier loads than concentric',
    'Rep counts differ from standard sets by design',
  ] as const,
  improveLines: [
    'Control the lowering for 3-5 seconds',
    'Use a spotter for heavy negatives',
    'Limit negatives to 1-2 sets per exercise',
  ] as const,
};

export const PARTIAL_SAME_WEIGHT: SetCommentaryOptions = {
  shortMessages: [
    'Partial Reps Done',
    'Partial ROM Work',
    'Partial Range In',
    'Partial Set Complete',
    'Partial Focus',
    'Partial Reps In',
  ] as const,
  tooltips: [
    'Partial set: {reps} partials',
    'Partial ROM: {reps} reps',
    'Partial range set: {reps}',
    'Partial reps completed: {reps}',
  ] as const,
  whyLines: [
    'Partial reps target specific range of motion',
    'Increased time under tension in the target range',
    'Partial ROM allows overload at end ranges',
    'Rep counts are not comparable to full ROM sets',
  ] as const,
  improveLines: [
    'Control the partial range carefully',
    'Combine with full ROM work for balance',
    'Use partials to target weak ROM points',
  ] as const,
};

export const FEEDER_SET_SAME_WEIGHT: SetCommentaryOptions = {
  shortMessages: [
    'Feeder Set Done',
    'Blood Flow Set',
    'Pre-Exhaustion In',
    'Feeder Work',
    'Activation Set',
    'Feeder Complete',
  ] as const,
  tooltips: [
    'Feeder set: {reps} reps',
    'Blood flow work: {reps}',
    'Activation set: {reps}',
    'Pre-exhaustion: {reps}',
  ] as const,
  whyLines: [
    'Feeder sets prime blood flow and activation',
    'Light weight is intentional for pre-exhaustion',
    'Prepares the muscle group for heavier work',
    'Feeder sets are not about maximal output',
  ] as const,
  improveLines: [
    'Use feeder sets before compound work',
    'Keep weight light, focus on the mind-muscle connection',
    'Adjust reps based on how the muscle feels',
  ] as const,
};

export const SET_TYPE_COMMENTARY_OVERRIDES: Record<string, SetCommentaryOptions> = {
  'dropset|weightDecrease_met': DROPSET_WEIGHT_DECREASE_MET,
  'dropset|weightDecrease_slightlyBelow': DROPSET_WEIGHT_DECREASE_SLIGHTLY_BELOW,
  'dropset|weightDecrease_significantlyBelow': DROPSET_WEIGHT_DECREASE_SIGNIFICANTLY_BELOW,
  'backoff|weightDecrease_met': BACKOFF_WEIGHT_DECREASE_MET,
  'backoff|weightDecrease_slightlyBelow': BACKOFF_WEIGHT_DECREASE_SLIGHTLY_BELOW,
  'backoff|weightDecrease_significantlyBelow': BACKOFF_WEIGHT_DECREASE_SIGNIFICANTLY_BELOW,
  'topset|weightIncrease_exceeded': TOPSET_WEIGHT_INCREASE_EXCEEDED,
  'topset|weightIncrease_met': TOPSET_WEIGHT_INCREASE_MET,
  'failure|sameWeight_repsIncreased': FAILURE_SAME_WEIGHT_REPS_INCREASED,
  'failure|sameWeight_repsSame': FAILURE_SAME_WEIGHT_REPS_SAME,
  'failure|sameWeight_dropMild': FAILURE_SAME_WEIGHT_DROP,
  'failure|sameWeight_dropModerate': FAILURE_SAME_WEIGHT_DROP,
  'failure|sameWeight_dropSevere': FAILURE_SAME_WEIGHT_DROP,
  'amrap|sameWeight_repsIncreased': AMRAP_SAME_WEIGHT_REPS_INCREASED,
  'amrap|sameWeight_repsSame': AMRAP_SAME_WEIGHT_REPS_SAME,
  'amrap|sameWeight_dropMild': AMRAP_SAME_WEIGHT_DROP,
  'amrap|sameWeight_dropModerate': AMRAP_SAME_WEIGHT_DROP,
  'amrap|sameWeight_dropSevere': AMRAP_SAME_WEIGHT_DROP,
  'restpause|sameWeight_dropMild': INTENSITY_TECHNIQUE_SAME_WEIGHT_DROP,
  'restpause|sameWeight_dropModerate': INTENSITY_TECHNIQUE_SAME_WEIGHT_DROP,
  'restpause|sameWeight_dropSevere': INTENSITY_TECHNIQUE_SAME_WEIGHT_DROP,
  'myoreps|sameWeight_dropMild': INTENSITY_TECHNIQUE_SAME_WEIGHT_DROP,
  'myoreps|sameWeight_dropModerate': INTENSITY_TECHNIQUE_SAME_WEIGHT_DROP,
  'myoreps|sameWeight_dropSevere': INTENSITY_TECHNIQUE_SAME_WEIGHT_DROP,
  'cluster|sameWeight_dropMild': INTENSITY_TECHNIQUE_SAME_WEIGHT_DROP,
  'cluster|sameWeight_dropModerate': INTENSITY_TECHNIQUE_SAME_WEIGHT_DROP,
  'cluster|sameWeight_dropSevere': INTENSITY_TECHNIQUE_SAME_WEIGHT_DROP,
  'left|sameWeight_repsIncreased': UNILATERAL_SAME_WEIGHT_REPS_INCREASED,
  'left|sameWeight_repsSame': UNILATERAL_SAME_WEIGHT_REPS_INCREASED,
  'right|sameWeight_repsIncreased': UNILATERAL_SAME_WEIGHT_REPS_INCREASED,
  'right|sameWeight_repsSame': UNILATERAL_SAME_WEIGHT_REPS_INCREASED,
  'left|sameWeight_dropMild': UNILATERAL_SAME_WEIGHT_DROP,
  'left|sameWeight_dropModerate': UNILATERAL_SAME_WEIGHT_DROP,
  'left|sameWeight_dropSevere': UNILATERAL_SAME_WEIGHT_DROP,
  'right|sameWeight_dropMild': UNILATERAL_SAME_WEIGHT_DROP,
  'right|sameWeight_dropModerate': UNILATERAL_SAME_WEIGHT_DROP,
  'right|sameWeight_dropSevere': UNILATERAL_SAME_WEIGHT_DROP,
  'negative|sameWeight_repsIncreased': NEGATIVE_SAME_WEIGHT,
  'negative|sameWeight_repsSame': NEGATIVE_SAME_WEIGHT,
  'negative|sameWeight_dropMild': NEGATIVE_SAME_WEIGHT,
  'negative|sameWeight_dropModerate': NEGATIVE_SAME_WEIGHT,
  'negative|sameWeight_dropSevere': NEGATIVE_SAME_WEIGHT,
  'partial|sameWeight_repsIncreased': PARTIAL_SAME_WEIGHT,
  'partial|sameWeight_repsSame': PARTIAL_SAME_WEIGHT,
  'partial|sameWeight_dropMild': PARTIAL_SAME_WEIGHT,
  'partial|sameWeight_dropModerate': PARTIAL_SAME_WEIGHT,
  'partial|sameWeight_dropSevere': PARTIAL_SAME_WEIGHT,
  'feederset|sameWeight_repsIncreased': FEEDER_SET_SAME_WEIGHT,
  'feederset|sameWeight_repsSame': FEEDER_SET_SAME_WEIGHT,
  'feederset|sameWeight_dropMild': FEEDER_SET_SAME_WEIGHT,
  'feederset|sameWeight_dropModerate': FEEDER_SET_SAME_WEIGHT,
  'feederset|sameWeight_dropSevere': FEEDER_SET_SAME_WEIGHT,
};

export const getSetTypeOverride = (
  setTypeId: SetTypeId,
  scenario: string
): SetCommentaryOptions | null => {
  const key = `${setTypeId}|${scenario}`;
  return SET_TYPE_COMMENTARY_OVERRIDES[key] ?? null;
};

export const INTENTIONAL_DROP_TYPES: Set<SetTypeId> = new Set(['dropset', 'backoff']);
export const INTENSITY_TYPES: Set<SetTypeId> = new Set(['failure', 'amrap', 'restpause', 'myoreps', 'cluster']);
export const UNILATERAL_TYPES: Set<SetTypeId> = new Set(['left', 'right']);
export const NONSTANDARD_TYPES: Set<SetTypeId> = new Set(['negative', 'partial', 'feederset', 'giantset', 'superset']);


