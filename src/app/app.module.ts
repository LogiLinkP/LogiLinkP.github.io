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


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataTablesModule,
    NoopAnimationsModule,
    MatSnackBarModule,
    HttpClientModule
  ],
  providers: [GetDetallesAlumnoService, SetDetallesAlumnoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
