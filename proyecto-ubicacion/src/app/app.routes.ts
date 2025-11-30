import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login';
import { RegisterComponent } from './components/auth/register';
import { VehiculosListaComponent } from './components/vehiculos-lista/vehiculos-lista';
import { VehiculosRegistro } from './components/vehiculos-registro/vehiculos-registro';
import { VehiculosActualizacion } from './components/vehiculos-actualizacion/vehiculos-actualizacion';
import { CallesListaComponent } from './components/calle-lista/calle-lista';
import { RutasMapaComponent } from './components/rutas-lista/rutas-lista';
import { authGuard } from './services/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'vehiculos', component: VehiculosListaComponent, canActivate: [authGuard] },
  { path: 'vehiculos/registro', component: VehiculosRegistro, canActivate: [authGuard] },
  { path: 'vehiculos/editar/:id', component: VehiculosActualizacion, canActivate: [authGuard] },
  { path: 'calles', component: CallesListaComponent, canActivate: [authGuard] },
  { path: 'rutas', component: RutasMapaComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
