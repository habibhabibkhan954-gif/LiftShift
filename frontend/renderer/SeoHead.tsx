import React from 'react';

const OG_IMAGE = 'https://liftshift.app/UI/logo.png';

export const SOFTWARE_APP_SCHEMA = '{"@context":"https://schema.org","@graph":[{"@type":"SoftwareApplication","name":"LiftShift","applicationCategory":"HealthApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"description":"Free workout analytics dashboard that turns Hevy, Strong, and Lyfta logs into visual training insights. Track volume trends, personal records, muscle heatmaps, and exercise progress locally in your browser.","url":"https://liftshift.app","image":"https://liftshift.app/UI/logo.png"},{"@type":"WebSite","name":"LiftShift","url":"https://liftshift.app","description":"Free workout analytics dashboard. Turn Hevy, Strong, and Lyfta workout logs into beautiful charts and insights.","potentialAction":{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https://liftshift.app/?q={search_term_string}"},"query-input":"required name=search_term_string"}}]}';

export type SeoHeadProps = {
  canonicalPath: string;
  isLanding: boolean;
};

export function SeoHead({ canonicalPath, isLanding }: SeoHeadProps) {
  const siteUrl = 'https://liftshift.app';
  const canonical = canonicalPath === '/' ? siteUrl : `${siteUrl}${canonicalPath.replace(/\/$/, '')}`;

  return (
    <>
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="LiftShift" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={OG_IMAGE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@LiftShift" />
      <meta name="twitter:image" content={OG_IMAGE} />

      {isLanding ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: SOFTWARE_APP_SCHEMA }}
        />
      ) : null}
    </>
  );
}
