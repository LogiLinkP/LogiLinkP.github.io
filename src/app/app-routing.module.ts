import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TablaComponent } from './vistas/resumen_practicas/resumen_practicas.component';
import { HomeComponent } from './vistas/home/home.component';
import { DetalleAlumnoComponent } from './vistas/alumno/alumno.component';

import { PnfComponent } from './componentes/pnf/pnf.component';
import { DetalleEncargadoComponent } from './vistas/detalle_practica/detalle_practica.component';
import { RevisionComponent } from './componentes/revision/revision.component';
import { FinalizacionComponent } from './componentes/finalizacion/finalizacion.component';
import { RegistroComponent } from './vistas/inscripcion_practica/inscripcion_practica.component';
import { EvaluacionComponent } from './vistas/evaluacion_supervisor/evaluacion_supervisor.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'encargado', component: TablaComponent },
  { path: 'encargado/:id', component: DetalleEncargadoComponent },
  { path: 'encargado/:id/revision/:n', component: RevisionComponent },
  { path: 'alumno/:id', component: DetalleAlumnoComponent },
  { path: 'alumno/:id/finalizacion/:n', component: FinalizacionComponent },
  { path: 'alumno/:id/registro/:n', component: RegistroComponent },
  { path: 'supervisor/evaluacion', component: EvaluacionComponent },
  { path: '**', component: PnfComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [HomeComponent,
  TablaComponent,
  PnfComponent,
  DetalleAlumnoComponent,
  DetalleEncargadoComponent,
  RevisionComponent,
  FinalizacionComponent,
  RegistroComponent,
  EvaluacionComponent]