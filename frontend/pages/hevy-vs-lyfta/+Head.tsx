export { Head };

import React from 'react';
import { CommonHead } from '../../renderer/CommonHead';
import { SeoHead } from '../../renderer/SeoHead';
import config from './+config';

const SCHEMA = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Article',
  'headline': 'Hevy vs Lyfta \u2014 Which Workout Tracker? Free &amp; Open Source Analytics Comparison',
  'description': 'Honest comparison of Hevy vs Lyfta: features, pricing, data export, and how LiftShift (free and open source, AGPL-3.0) adds analytics both apps lack.',
  'author': { '@type': 'Organization', 'name': 'LiftShift', 'url': 'https://liftshift.app/' },
  'publisher': { '@type': 'Organization', 'name': 'LiftShift', 'url': 'https://liftshift.app/' },
  'url': 'https://liftshift.app/hevy-vs-lyfta/',
  'mainEntityOfPage': 'https://liftshift.app/hevy-vs-lyfta/',
});

function Head() {
  return (
    <>
      <CommonHead />
      <SeoHead canonicalPath="/hevy-vs-lyfta/" isLanding={false} title={config.title} description={config.description} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: SCHEMA }} />
    </>
  );
}
