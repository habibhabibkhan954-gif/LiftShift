export { Head };

import React from 'react';
import { CommonHead } from '../../renderer/CommonHead';
import { SeoHead } from '../../renderer/SeoHead';

function Head() {
  return (
    <>
      <CommonHead />
      <SeoHead canonicalPath="/app/" isLanding={false} />
    </>
  );
}
