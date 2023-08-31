import { Component } from '@angular/core';
import { UsuarioSupervisorService } from 'src/app/servicios/usuario-supervisor/usuario-supervisor.service';
import { StorageUserService } from 'src/app/servicios/usuario/storage-user.service';
import * as dayjs from 'dayjs'
dayjs().format()
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

@Component({
  selector: 'app-vista-supervisor',
  templateUrl: './vista-supervisor.component.html',
  styleUrls: ['./vista-supervisor.component.scss']
})
export class VistaSupervisorComponent {

  estudiantes: any;
  list: any[] = [];

  constructor(public storage: StorageUserService, private service: UsuarioSupervisorService) {}

  ngOnInit(): void {
    let id = this.storage.getUser().userdata.id;
    let response: any = {};
    this.service.buscar_estudiantes(id).subscribe({
      next: (data: any) => {
        response = { ...response, ...data }
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        this.estudiantes = response.body;
        //dayjs(informe.fecha, "YYYY-MM-DDTHH:mm:ssZ").format("DD/MM/YYYY")

        for (let estudiante of this.estudiantes.body) {
          let nombre = estudiante.nombre;
          let correo = estudiante.correo;
          let rut_empresa = estudiante.rut_empresa;
          let nombre_empresa = estudiante.nombre_empresa;
          let estado = estudiante.estado;
          let inicio = dayjs(estudiante.inicio, "YYYY-MM-DDTHH:mm:ssZ").format("DD/MM/YYYY");
          let fin = dayjs(estudiante.fin, "YYYY-MM-DDTHH:mm:ssZ").format("DD/MM/YYYY");
          this.list.push({nombre,correo,rut_empresa,nombre_empresa,estado,inicio,fin});
        }

      }
    });
  }

}
