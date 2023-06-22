import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';

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
//import { IniciarPracticaComponent } from './componentes/iniciar-practica/iniciar-practica.component';



@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    EvaluacionComponent,
    DatosPracticaComponent,
    //IniciarPracticaComponent,
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
    MatToolbarModule
  ],
  providers: [GetDetallesAlumnoService, SetDetallesAlumnoService, ArchivosService, SupervisorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
