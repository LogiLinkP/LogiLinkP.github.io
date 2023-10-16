import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-plagios',
  templateUrl: './plagios.component.html',
  styleUrls: ['./plagios.component.scss']
})
export class PlagiosComponent {

  id_practica: number;

  constructor(private route: ActivatedRoute) {
    this.id_practica = parseInt(this.route.snapshot.url[1].path);
    console.log(this.id_practica);
  }
}
