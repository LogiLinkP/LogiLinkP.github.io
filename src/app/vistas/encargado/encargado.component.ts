import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-encargado',
  templateUrl: './encargado.component.html',
  styleUrls: ['./encargado.component.css']
})
export class EncargadoComponent implements OnInit {
  loaded: boolean = true;

  ngOnInit() {
    setTimeout(()=>{
      this.loaded = false;
    }
    , 3000);
  }

}
