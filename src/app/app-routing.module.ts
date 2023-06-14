import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablaComponent } from './tabla/tabla.component';
import { HomeComponent } from './home/home.component';
import { PnfComponent } from './pnf/pnf.component';
import { DetalleAlumnoComponent } from './detalle-alumno/detalle-alumno.component';
import { DetalleEncargadoComponent } from './detalle-encargado/detalle-encargado.component';
import { RevisionComponent } from './revision/revision.component';
import { FinalizacionComponent } from './finalizacion/finalizacion.component';
import { RegistroComponent } from './registro/registro.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'encargado', component: TablaComponent},
  {path: 'encargado/:id', component: DetalleEncargadoComponent},
  {path: 'encargado/:id/revision/:n', component: RevisionComponent},
  {path: 'alumno/:id', component: DetalleAlumnoComponent},
  {path: 'alumno/:id/finalizacion/:n', component: FinalizacionComponent},
  {path: 'alumno/:id/registro/:n', component: RegistroComponent},
  {path: '**', component: PnfComponent}
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
                                  DetalleEncargadoComponent,
                                  RevisionComponent,
                                  FinalizacionComponent,
                                  RegistroComponent]