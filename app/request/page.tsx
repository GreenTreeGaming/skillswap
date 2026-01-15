import { Suspense } from 'react';
import RequestClient from './RequestClient';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RequestClient />
    </Suspense>
  );
}