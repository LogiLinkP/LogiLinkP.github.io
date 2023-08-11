import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './vistas/home/home.component';
import { DetalleAlumnoComponent } from './vistas/alumno/alumno.component';
import { LoginComponent } from './vistas/login/login.component';
import { RegistroComponent } from './vistas/registro/registro.component';
import { BlankComponent } from './vistas/blank/blank.component';
import { ForgotPasswordComponent } from './vistas/forgot-password/forgot-password.component';
import { EstadisticasComponent } from './vistas/estadisticas/estadisticas.component';
import { DetallePracticaComponent } from './vistas/detalle-practica/detalle-practica.component';
import { InformacionesComponent } from './vistas/informaciones/informaciones.component';

import { PnfComponent } from './componentes/pnf/pnf.component';
import { RevisionComponent } from './componentes/revision/revision.component';
import { FinalizacionComponent } from './componentes/finalizacion/finalizacion.component';
import { EvaluacionComponent } from './vistas/evaluacion_supervisor/evaluacion_supervisor.component';
import { IniciarPracticaComponent } from './componentes/iniciar-practica/iniciar-practica.component';
import { FileComponent } from './componentes/file/file.component';

import { TestsComponent } from './vistas/tests/tests.component';
import { EmpresasComponent } from './vistas/empresas/empresas.component';
import { CuestionarioComponent } from './vistas/cuestionario/cuestionario.component';
import { EncargadoComponent } from './vistas/encargado/encargado.component';
import { ChatComponent } from './componentes/chat/chat.component';
import { NotificacionesComponent } from './componentes/notificaciones/notificaciones.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'encargado', component: EncargadoComponent },
  { path: 'encargado/:id', component: DetallePracticaComponent},
  { path: 'encargado/:id/revision/:n', component: RevisionComponent },
  { path: 'alumno/:id', component: DetalleAlumnoComponent },
  { path: 'alumno/:id/cuestionario', component: CuestionarioComponent},
  { path: 'alumno/:id/empresas', component: EmpresasComponent},
  { path: 'alumno/:id/finalizacion/:n', component: FinalizacionComponent },
  { path: 'alumno/:id/iniciarpractica/:n', component: IniciarPracticaComponent },
  { path: 'supervisor/evaluacion', component: EvaluacionComponent },
  { path: 'tests', component: TestsComponent},
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'blank', component: BlankComponent },
  { path: 'resetPass', component: ForgotPasswordComponent },
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: 'informaciones', component: InformacionesComponent },
  { path: ':tipo/:id/chat/:id2', component: ChatComponent},
  { path: ':tipo/:id/notificaciones', component: NotificacionesComponent},
  { path: '**', component: PnfComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [HomeComponent,
  PnfComponent,
  DetalleAlumnoComponent,
  DetallePracticaComponent,
  RevisionComponent,
  FinalizacionComponent,
  EvaluacionComponent,
  IniciarPracticaComponent,
  FileComponent,
  LoginComponent,
  RegistroComponent,
  BlankComponent,
  ForgotPasswordComponent,
  EstadisticasComponent,
  InformacionesComponent,
  TestsComponent,
  EmpresasComponent,
  CuestionarioComponent,
  EncargadoComponent,
  NotificacionesComponent,
]