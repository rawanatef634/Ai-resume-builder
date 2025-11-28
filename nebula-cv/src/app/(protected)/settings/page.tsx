// src/app/(protected)/settings/page.tsx (New Server Component)

import { Suspense } from 'react';
import SettingsContent from './SettingsContent';

export default function SettingsPageServer() {
  return (
    <Suspense fallback={<div>Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}