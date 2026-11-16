import React from 'react';
import { SuperAdminDashboard } from '@/components/SuperAdminDashboard';

export const metadata = {
  title: 'Consola SuperAdmin | Loyal SaaS Platform',
  description: 'Panel de administración maestro de empresas, clientes y suscripciones para el dueño del SaaS Loyal.',
};

export default function SuperAdminPage() {
  return <SuperAdminDashboard />;
}
