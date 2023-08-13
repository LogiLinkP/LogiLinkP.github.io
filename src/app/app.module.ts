import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ArchivosService } from './servicios/archivos/archivos.service';
import { GetDetallesAlumnoService } from './servicios/encargado/resumen_practicas.service';
import { SetDetallesAlumnoService } from './servicios/encargado/decision.service';
import { SupervisorService } from './servicios/supervisor/supervisor.service';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataTablesModule } from "angular-datatables";
import { EvaluacionComponent } from './vistas/evaluacion_supervisor/evaluacion_supervisor.component';
import { DatosPracticaComponent } from './componentes/datos-practica/datos-practica.component';
import { UpInformeComponent } from './componentes/up-informe/up-informe.component';
import { TablaComponent } from './componentes/resumen_practicas/resumen_practicas.component';
import { ChatComponent } from './componentes/chat/chat.component';
import { CookieService } from 'ngx-cookie-service';
import { TestBarraComponent } from './componentes/test-barra/test-barra.component';

import {MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {TextFieldModule} from '@angular/cdk/text-field';
import { RegisterComponent } from './componentes/register/register.component';
import { LogoutComponent } from './componentes/logout/logout.component';
import { DetallePracticaComponent } from './vistas/detalle-practica/detalle-practica.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { FooterComponent } from './componentes/footer/footer.component';
import { BarraSuperiorComponent } from './componentes/barra-superior/barra-superior.component';
import { LogoutModalComponent } from './componentes/logout-modal/logout-modal.component';
import { LoginComponent } from './vistas/login/login.component';
import { TestsComponent } from './vistas/tests/tests.component';
import { BarraLateralAlumnoComponent } from './componentes/barra-lateral-alumno/barra-lateral-alumno.component';
import { BlankComponent } from './vistas/blank/blank.component';
import { RegistroComponent } from './vistas/registro/registro.component';
import { ForgotPasswordComponent } from './vistas/forgot-password/forgot-password.component';
import { BarraLateralEncargadoComponent } from './componentes/barra-lateral-encargado/barra-lateral-encargado.component';
import { EstadisticasComponent } from './vistas/estadisticas/estadisticas.component';
import { BotonSolicitarArchivoComponent } from './boton-solicitar-archivo/boton-solicitar-archivo.component';
import { InformacionesComponent } from './vistas/informaciones/informaciones.component';

import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    EvaluacionComponent,
    DatosPracticaComponent,
    RegisterComponent,
    LogoutComponent,
    DetallePracticaComponent,
    FooterComponent,
    BarraSuperiorComponent,
    LogoutModalComponent,
    LoginComponent,
    TestsComponent,
    BarraLateralAlumnoComponent,
    BlankComponent,
    RegistroComponent,
    ForgotPasswordComponent,
    BarraLateralEncargadoComponent,
    EstadisticasComponent,
    InformacionesComponent,
    TestBarraComponent,
    BotonSolicitarArchivoComponent,
    UpInformeComponent,
    TablaComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataTablesModule,
    MatButtonModule,
    NoopAnimationsModule,
    MatSnackBarModule,
    HttpClientModule,
    NgbModule,
    MatInputModule,
    MatCardModule,
    MatListModule,
    MatDatepickerModule,
    MatSelectModule,
    MatToolbarModule,
    TextFieldModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    FormsModule,
    ],
  providers: [
    GetDetallesAlumnoService,
    SetDetallesAlumnoService,
    ArchivosService,
    SupervisorService,
    DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
