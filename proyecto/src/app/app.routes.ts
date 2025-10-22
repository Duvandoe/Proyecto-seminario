import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'mapa', loadComponent: () => import('./mapa/mapa.component').then(m => m.MapaComponent) },
  { path: 'perfil', loadComponent: () => import('./perfil/perfil').then(m => m.PerfilComponent) },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
