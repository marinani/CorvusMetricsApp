import { Routes } from '@angular/router';

export const tenantsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tenants.component').then((m) => m.TenantsComponent),
  },
];