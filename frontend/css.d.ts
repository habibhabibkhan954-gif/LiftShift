import 'react';

declare module 'react' {
  interface CSSProperties {
    '--darkreader-inline-fill'?: string;
    '--darkreader-inline-stroke'?: string;
    '--darkreader-inline-bgcolor'?: string;
    '--darkreader-inline-color'?: string;
  }
}
