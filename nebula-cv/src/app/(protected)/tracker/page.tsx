// src/app/(protected)/tracker/page.tsx (New Server Component)

import { Suspense } from 'react';
import TrackerContent from './TrackerContent';

export default function TrackerPageServer() {
  return (
    // The Suspense boundary allows the outer page to be statically rendered (SSG)
    // while delaying the rendering of the dynamic content until client-side hydration.
    <Suspense fallback={<div>Loading tracker...</div>}>
      <TrackerContent />
    </Suspense>
  );
}