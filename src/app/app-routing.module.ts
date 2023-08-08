import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TablaComponent } from './vistas/resumen_practicas/resumen_practicas.component';
import { HomeComponent } from './vistas/home/home.component';
import { DetalleAlumnoComponent } from './vistas/alumno/alumno.component';
import { DetallePracticaComponent } from './vistas/detalle-practica/detalle-practica.component';

import { PnfComponent } from './componentes/pnf/pnf.component';
import { RevisionComponent } from './componentes/revision/revision.component';
import { FinalizacionComponent } from './componentes/finalizacion/finalizacion.component';
import { EvaluacionComponent } from './vistas/evaluacion_supervisor/evaluacion_supervisor.component';
import { IniciarPracticaComponent } from './componentes/iniciar-practica/iniciar-practica.component';
import { FileComponent } from './componentes/file/file.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'encargado', component: TablaComponent },
  { path: 'encargado/:id', component: DetallePracticaComponent},
  { path: 'encargado/:id/revision/:n', component: RevisionComponent },
  { path: 'alumno/:id', component: DetalleAlumnoComponent },
  { path: 'alumno/:id/finalizacion/:n', component: FinalizacionComponent },
  { path: 'alumno/:id/iniciarpractica/:n', component: IniciarPracticaComponent },
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
  DetallePracticaComponent,
  RevisionComponent,
  FinalizacionComponent,
  EvaluacionComponent,
  IniciarPracticaComponent,
  FileComponent
]