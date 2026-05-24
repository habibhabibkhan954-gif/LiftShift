export { Head };

import React from 'react';
import { CommonHead } from '../../renderer/CommonHead';
import { SeoHead } from '../../renderer/SeoHead';
import config from './+config';

function Head() {
  return (
    <>
      <CommonHead />
      <SeoHead canonicalPath="/" isLanding={true} title={config.title} description={config.description} />
    </>
  );
}
