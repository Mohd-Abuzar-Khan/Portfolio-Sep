import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent), title: 'Mohd Abuzar Khan — Full Stack & AI' },
  { path: 'project/:slug', loadComponent: () => import('./pages/project-detail/project-detail.component').then((m) => m.ProjectDetailComponent), title: 'Project — Abuzar' },
  { path: '**', redirectTo: '' },
];
