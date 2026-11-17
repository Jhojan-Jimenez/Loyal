import React from 'react';
import TenantJoinPage from './join/page';

export const dynamic = 'force-dynamic';

export default async function TenantRootPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return TenantJoinPage({ params });
}
