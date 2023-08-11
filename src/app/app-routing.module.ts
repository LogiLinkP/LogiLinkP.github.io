import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TablaComponent } from './vistas/resumen_practicas/resumen_practicas.component';
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
import { RegisterComponent } from './componentes/register/register.component';
import { LogoutComponent } from './componentes/logout/logout.component';

import { TestsComponent } from './vistas/tests/tests.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'encargado', component: TablaComponent },
  { path: 'encargado/:id', component: DetallePracticaComponent},
  { path: 'encargado/:id/revision/:n', component: RevisionComponent },
  { path: 'alumno/:id', component: DetalleAlumnoComponent },
  { path: 'alumno/:id/finalizacion/:n', component: FinalizacionComponent },
  { path: 'alumno/:id/iniciarpractica/:n', component: IniciarPracticaComponent },
  { path: 'supervisor/evaluacion', component: EvaluacionComponent },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'logout', component: LogoutComponent},
  { path: 'tests', component: TestsComponent},
  { path: 'registro', component: RegistroComponent },
  { path: 'blank', component: BlankComponent },
  { path: 'resetPass', component: ForgotPasswordComponent },
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: 'informaciones', component: InformacionesComponent },
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
  FileComponent,
  LoginComponent,
  RegisterComponent,
  LogoutComponent,
  RegistroComponent,
  BlankComponent,
  ForgotPasswordComponent,
  EstadisticasComponent,
  InformacionesComponent,
  TestsComponent
]