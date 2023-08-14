import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit{
  Id: string;

  constructor(private route: ActivatedRoute){}

  ngOnInit(){
  this.Id = this.route.snapshot.paramMap.get("id")!;
  }

}
