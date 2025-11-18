import { Routes } from '@angular/router';
import { VehiculosListaComponent } from './components/vehiculos-lista/vehiculos-lista';
import { VehiculosActualizacion } from './components/vehiculos-actualizacion/vehiculos-actualizacion';
import { VehiculosRegistro } from './components/vehiculos-registro/vehiculos-registro';
import { CallesListaComponent } from './components/calle-lista/calle-lista';
import { RutasMapaComponent } from './components/rutas-lista/rutas-lista';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';

export const routes: Routes = [

    {path: 'vehiculos', component: VehiculosListaComponent},
    {path: 'vehiculos/registro', component: VehiculosRegistro},
    {path: 'vehiculos/editar/:id', component: VehiculosActualizacion},
    { path: '', redirectTo: 'rutas', pathMatch: 'full' },
    { path: 'calles', component: CallesListaComponent },
    { path: 'rutas', component: RutasMapaComponent },
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent }

];
