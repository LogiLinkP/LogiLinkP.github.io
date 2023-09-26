import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetalleAlumnoComponent } from './vistas/alumno/alumno.component';
import { LoginComponent } from './vistas/login/login.component';
import { RegistroComponent } from './vistas/registro/registro.component';
import { BlankComponent } from './vistas/blank/blank.component';
import { ForgotPasswordComponent } from './vistas/forgot-password/forgot-password.component';
import { EstadisticasComponent } from './vistas/estadisticas/estadisticas.component';
import { DetallePracticaComponent } from './vistas/detalle-practica/detalle-practica.component';
import { EmpresasComponent } from './vistas/empresas/empresas.component';
import { CuestionarioComponent } from './vistas/cuestionario/cuestionario.component';
import { TablaComponent } from './vistas/resumen_practicas/resumen_practicas.component';
import { ConfiguracionPracticaComponent } from './vistas/configuracion-practica/configuracion-practica.component';
import { EncuestaFinPracticaComponent } from './vistas/encuesta-fin-practica/encuesta-fin-practica.component';
//import { ConsistenciaComponent } from './vistas/consistencia/consistencia.component';
import { ExplicacionConsistenciaComponent } from './vistas/explicacion-consistencia/explicacion-consistencia.component';
import { VistaSupervisorComponent } from './vistas/vista-supervisor/vista-supervisor/vista-supervisor.component';
import { PnfComponent } from './componentes/pnf/pnf.component';
import { RevisionComponent } from './componentes/revision/revision.component';
import { EvaluacionComponent } from './vistas/evaluacion_supervisor/evaluacion_supervisor.component';
import { IniciarPracticaComponent } from './componentes/iniciar-practica/iniciar-practica.component';
import { FileComponent } from './componentes/file/file.component';
import { ChatComponent } from './componentes/chat/chat.component';
import { InformeComponent } from "./vistas/informe/informe.component";
import { NotisHistorialComponent } from './vistas/notis-historial/notis-historial.component';
import { RamosAlumnosComponent } from './vistas/ramos-alumnos/ramos-alumnos.component';
import { RamosEncargadoComponent } from './vistas/ramos-encargado/ramos-encargado.component';
import { EstadisticaEmpresasComponent } from './vistas/estadistica-empresas/estadistica-empresas.component';
import { AdminComponent } from './vistas/admin/admin.component';
import { CrearCarreraComponent } from './vistas/crear-carrera/crear-carrera.component';
import { CrearEncargadoComponent } from './vistas/crear-encargado/crear-encargado.component';
import { AsignacionComponent } from './vistas/asignacion/asignacion.component';
import { RegistroEncargadoComponent } from './vistas/registro-encargado/registro-encargado.component';
import { IngresoInformeComponent } from './vistas/ingreso-informe/ingreso-informe.component';
import { EstudianteVerInformeComponent } from './vistas/estudiante-ver-informe/estudiante-ver-informe.component';
import { EliminarEncargadoComponent } from './vistas/eliminar-encargado/eliminar-encargado.component';

import { environment } from 'src/environments/environment';
import { PerfilComponent } from './vistas/perfil/perfil.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: environment.ruta_practicas, component: TablaComponent },
  { path: environment.ruta_practicas + '/:id', component: DetallePracticaComponent },
  { path: environment.ruta_practicas + '/:id/revision/:n', component: RevisionComponent },
  {
    path: environment.ruta_alumno,
    children: [
      {
        path: ':id', component: DetalleAlumnoComponent,
        children: [
          { path: 'cuestionario/:n', component: CuestionarioComponent },
          { path: 'empresas', component: EmpresasComponent },
          { path: 'iniciarpractica/:n', component: IniciarPracticaComponent },
          { path: 'perfil', component: PerfilComponent}
        ]
      }
    ]
  },
  { path: 'home_supervisor', component: VistaSupervisorComponent},
  { path: environment.ruta_supervisor + '/evaluacion', component: EvaluacionComponent },
  { path: environment.ruta_registro, component: RegistroComponent, data: { title: 'Registro' } },
  { path: environment.ruta_login, component: LoginComponent, data: { title: 'Login' } },
  { path: 'blank', component: BlankComponent },
  { path: 'resetPass', component: ForgotPasswordComponent },
  { path: 'estadisticas', component: EstadisticasComponent },
  { 
    path: 'admin', 
    children: [
      { path: '', component: AdminComponent},
      { path: 'crear-carrera', component: CrearCarreraComponent },
      { path: 'crear-encargado', component: CrearEncargadoComponent },
      { path: 'asignacion', component: AsignacionComponent},
      { path: 'eliminar-encargado', component: EliminarEncargadoComponent },
    ] 
  },
  { path: 'encargado/registro/:token', component: RegistroEncargadoComponent },
  // { path: ':tipo/:id/notificaciones', component: NotificacionesComponent},
  { path: 'configurar/:nombre', component: ConfiguracionPracticaComponent },
  { path: 'configurar/:nombre/copia', component: ConfiguracionPracticaComponent },
  { path: environment.ruta_alumno + '/:id/chat/:room/:id1/:id2/:tipo', component: ChatComponent },
  { path: environment.ruta_alumno +'/:id/historial', component: NotisHistorialComponent},
  { path: "historial", component: NotisHistorialComponent},
  { path: 'chat/:room/:id1/:id2/:tipo', component: ChatComponent },
  { path: 'informe/:id_practica/:id_informe', component: InformeComponent },
  { path: 'encuestaFinal/:id_practica', component: EncuestaFinPracticaComponent },
  { path: 'consistencia', component: ExplicacionConsistenciaComponent },
  { path: 'estadisticaRamos', component: RamosAlumnosComponent},
  { path: 'ramos', component: RamosEncargadoComponent},
  { path: 'estadisticaEmpresas', component: EstadisticaEmpresasComponent},
  { path: 'perfil', component: PerfilComponent},
  { path: 'ingreso-informe', component: IngresoInformeComponent},
  { path: 'estudiante-ver-informe/:id_practica/:id_informe', component: EstudianteVerInformeComponent},
  { path: '**', component: PnfComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  PnfComponent,
  DetalleAlumnoComponent,
  DetallePracticaComponent,
  RevisionComponent,
  EvaluacionComponent,
  IniciarPracticaComponent,
  FileComponent,
  LoginComponent,
  RegistroComponent,
  BlankComponent,
  ForgotPasswordComponent,
  EstadisticasComponent,
  EmpresasComponent,
  CuestionarioComponent,
  ChatComponent,
  ConfiguracionPracticaComponent,
  AdminComponent,
  CrearCarreraComponent,
  CrearEncargadoComponent,
  AsignacionComponent,
  RegistroEncargadoComponent,
  EliminarEncargadoComponent,
  EncuestaFinPracticaComponent,
  PerfilComponent,
  IngresoInformeComponent,
  EstudianteVerInformeComponent,
  EncuestaFinPracticaComponent
]
