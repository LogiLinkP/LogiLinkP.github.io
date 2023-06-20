import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IniciarPracticaComponent } from './iniciar-practica.component';

describe('IniciarPracticaComponent', () => {
  let component: IniciarPracticaComponent;
  let fixture: ComponentFixture<IniciarPracticaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IniciarPracticaComponent]
    });
    fixture = TestBed.createComponent(IniciarPracticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
