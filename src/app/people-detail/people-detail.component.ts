import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-people-detail',
  templateUrl: './people-detail.component.html',
  styleUrls: ['./people-detail.component.css']
})
export class PeopleDetailComponent {
  public personal_Id: number = 0;
  constructor(private route: ActivatedRoute){}
  
  ngOnInit(){
    let ID: number = parseInt(this.route.snapshot.paramMap.get('Id')!);
    this.personal_Id = ID;
  }
}
