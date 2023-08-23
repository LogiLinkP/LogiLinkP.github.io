import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {
  private message = new BehaviorSubject('default message');
  getMessage = this.message.asObservable();

  constructor() { }

  setMessage(msg: string) {
    this.message.next(msg);
  }
  
}
