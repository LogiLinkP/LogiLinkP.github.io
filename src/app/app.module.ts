import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { GetDetallesAlumnoService } from './Servicios/get-detalles-alumno.service';
import { DataTablesModule } from "angular-datatables";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataTablesModule,
    NoopAnimationsModule
  ],
  providers: [GetDetallesAlumnoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
