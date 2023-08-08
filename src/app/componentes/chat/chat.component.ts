import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  Id: number = -1;
  Nmensaje:String="";
  Historial:any=[];

  constructor(private router: ActivatedRoute) {
    this.router.params.subscribe(params => {this.Id = +params['id'];});
  }

  enviarmensaje(){
    this.Nmensaje="";
  }

}
