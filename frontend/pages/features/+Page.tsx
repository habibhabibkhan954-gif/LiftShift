export { Page };

import React from 'react';
import { InfoShell } from '../../components/info/InfoShell';
import { FeaturesDoc } from '../../components/features/ui/FeaturesDoc';

function Page() {
  return (
    <InfoShell
      activeNav="features"
      title="Features"
      subtitle="Everything LiftShift can do with your workout data. Connect Hevy, Strong, or Lyfta in seconds."
    >
      <FeaturesDoc showTitle={false} />
    </InfoShell>
  );
}
