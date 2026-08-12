import { Routes } from '@angular/router';

export const acquisitionChannelsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./acquisition-channels.component').then((m) => m.AcquisitionChannelsComponent),
  },
];