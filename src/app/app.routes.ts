import { Routes } from '@angular/router';
import { VehiculosListaComponent } from './components/vehiculos-lista/vehiculos-lista';
import { VehiculosActualizacion } from './components/vehiculos-actualizacion/vehiculos-actualizacion';
import { VehiculosRegistro } from './components/vehiculos-registro/vehiculos-registro';
import { CallesListaComponent } from './components/calle-lista/calle-lista';
import { RutasMapaComponent } from './components/rutas-lista/rutas-lista';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'vehiculos', component: VehiculosListaComponent, canActivate: [authGuard] },
    { path: 'vehiculos/registro', component: VehiculosRegistro, canActivate: [authGuard] },
    { path: 'vehiculos/editar/:id', component: VehiculosActualizacion, canActivate: [authGuard] },
    { path: 'calles', component: CallesListaComponent, canActivate: [authGuard] },
    { path: 'rutas', component: RutasMapaComponent, canActivate: [authGuard] }
];
