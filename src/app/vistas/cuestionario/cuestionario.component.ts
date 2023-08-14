import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.css']
})
export class CuestionarioComponent implements OnInit{
  Id: string;

  constructor(private route: ActivatedRoute){}

  ngOnInit(){
  this.Id = this.route.snapshot.paramMap.get("id")!;
  }

}
