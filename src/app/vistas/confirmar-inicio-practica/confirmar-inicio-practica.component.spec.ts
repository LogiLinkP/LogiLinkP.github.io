import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarInicioPracticaComponent } from './confirmar-inicio-practica.component';

describe('ConfirmarInicioPracticaComponent', () => {
  let component: ConfirmarInicioPracticaComponent;
  let fixture: ComponentFixture<ConfirmarInicioPracticaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmarInicioPracticaComponent]
    });
    fixture = TestBed.createComponent(ConfirmarInicioPracticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
