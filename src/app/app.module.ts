import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { GetDetallesAlumnoService } from './Servicios/get-detalles-alumno.service';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [GetDetallesAlumnoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
