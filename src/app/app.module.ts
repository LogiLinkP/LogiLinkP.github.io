import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { GetDetallesAlumnoService } from './Servicios/get-detalles-alumno.service';
import { SetDetallesAlumnoService } from './Servicios/set-detalles-alumno.service';
import { DataTablesModule } from "angular-datatables";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ArchivosService } from './Servicios/archivos.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EvaluacionComponent } from './supervisor/evaluacion/evaluacion.component';
import { SupervisorService } from './Servicios/supervisor.service';


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    EvaluacionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataTablesModule,
    NoopAnimationsModule,
    MatSnackBarModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [GetDetallesAlumnoService, SetDetallesAlumnoService, ArchivosService, SupervisorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
