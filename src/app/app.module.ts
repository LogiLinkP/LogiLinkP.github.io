import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import {FormsModule} from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ArchivosService } from './servicios/archivos/archivos.service';
import { GetDetallesAlumnoService } from './servicios/encargado/resumen_practicas.service';
import { SetDetallesAlumnoService } from './servicios/encargado/decision.service';
import { SupervisorService } from './servicios/supervisor/supervisor.service';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataTablesModule } from "angular-datatables";
import { EvaluacionComponent } from './vistas/evaluacion_supervisor/evaluacion_supervisor.component';
import { MatButtonModule } from '@angular/material/button';
import { DatosPracticaComponent } from './componentes/datos-practica/datos-practica.component';
import { LoginComponent } from './componentes/login/login.component';
import { CookieService } from 'ngx-cookie-service';

import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {TextFieldModule} from '@angular/cdk/text-field';
import { RegisterComponent } from './componentes/register/register.component';
import { LogoutComponent } from './componentes/logout/logout.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    EvaluacionComponent,
    DatosPracticaComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
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
    ],
  providers: [GetDetallesAlumnoService, SetDetallesAlumnoService, ArchivosService, SupervisorService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
