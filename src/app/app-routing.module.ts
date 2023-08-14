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
import { LogoutComponent } from './componentes/logout/logout.component';
import { ChatComponent } from './componentes/chat/chat.component';

import { TestsComponent } from './vistas/tests/tests.component';
import { EmpresasComponent } from './vistas/empresas/empresas.component';
import { CuestionarioComponent } from './vistas/cuestionario/cuestionario.component';
import { NotificacionesComponent } from './componentes/notificaciones/notificaciones.component';
import { TablaComponent } from './vistas/resumen_practicas/resumen_practicas.component';

import { environment } from 'src/environments/environment';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: environment.ruta_practicas, component: TablaComponent },
  { path: environment.ruta_practicas+'/:id', component: DetallePracticaComponent},
  { path: environment.ruta_practicas+'/:id/revision/:n', component: RevisionComponent },
  { path: environment.ruta_alumno+'/:id', component: DetalleAlumnoComponent },
  { path: environment.ruta_alumno+'/:id/cuestionario', component: CuestionarioComponent},
  { path: environment.ruta_alumno+'/:id/empresas', component: EmpresasComponent},
  { path: environment.ruta_alumno+'/:id/finalizacion/:n', component: FinalizacionComponent },
  { path: environment.ruta_alumno+'/:id/iniciarpractica/:n', component: IniciarPracticaComponent },
  { path: 'supervisor/evaluacion', component: EvaluacionComponent },
  { path: 'login', component: LoginComponent},
  { path: 'logout', component: LogoutComponent},
  { path: 'tests', component: TestsComponent},
  { path: 'registro', component: RegistroComponent },
  { path: 'blank', component: BlankComponent },
  { path: 'resetPass', component: ForgotPasswordComponent },
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: 'informaciones', component: InformacionesComponent },
  { path: ':tipo/:id/notificaciones', component: NotificacionesComponent},
  { path: '**', component: PnfComponent },
  { path: ':tipo/:id/chat/:id2', component: ChatComponent}
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
  LogoutComponent,
  RegistroComponent,
  BlankComponent,
  ForgotPasswordComponent,
  EstadisticasComponent,
  InformacionesComponent,
  TestsComponent,
  EmpresasComponent,
  CuestionarioComponent,
  NotificacionesComponent,
  ChatComponent
]