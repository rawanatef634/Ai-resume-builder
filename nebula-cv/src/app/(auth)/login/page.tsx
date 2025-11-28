// src/app/login/page.tsx (New Server Component File)

import { Suspense } from 'react';
import LoginContent from './LoginContent'; // Import the client content

/**
 * This is the Server Component entry point for the /login route.
 * It wraps the client-side component (LoginContent) which uses 
 * useSearchParams() in a <Suspense> boundary to avoid the 
 * "prerender error" during the build.
 */
export default function LoginPageServer() {
  return (
    <Suspense fallback={<div>Loading authentication form...</div>}>
      <LoginContent />
    </Suspense>
  );
}