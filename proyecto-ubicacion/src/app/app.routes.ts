import { Routes } from '@angular/router';
import { VehiculosListaComponent } from './components/vehiculos-lista/vehiculos-lista';
import { VehiculosActualizacion } from './components/vehiculos-actualizacion/vehiculos-actualizacion';
import { VehiculosRegistro } from './components/vehiculos-registro/vehiculos-registro';

export const routes: Routes = [

    {path: 'vehiculos', component: VehiculosListaComponent},
    {path: 'vehiculos/registro', component: VehiculosRegistro},
    {path: 'vehiculos/editar/:id', component: VehiculosActualizacion},
    {path: '' , redirectTo: 'vehiculos', pathMatch: 'full'},

];
