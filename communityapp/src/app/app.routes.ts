import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'publications',
    loadComponent: () =>
      import('./components/publication-list/publication-list.component').then(
        (m) => m.PublicationListComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./components/publication-form/publication-form.component').then(
        (m) => m.PublicationFormComponent
      ),
  },
  {
    path: '',
    redirectTo: 'publications',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'publications',
  },
];
