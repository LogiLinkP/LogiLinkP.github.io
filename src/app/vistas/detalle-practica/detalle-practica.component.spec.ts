import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePracticaComponent } from './detalle-practica.component';

describe('DetallePracticaComponent', () => {
  let component: DetallePracticaComponent;
  let fixture: ComponentFixture<DetallePracticaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallePracticaComponent]
    });
    fixture = TestBed.createComponent(DetallePracticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
