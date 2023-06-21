import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosPracticaComponent } from './datos-practica.component';

describe('DatosPracticaComponent', () => {
  let component: DatosPracticaComponent;
  let fixture: ComponentFixture<DatosPracticaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatosPracticaComponent]
    });
    fixture = TestBed.createComponent(DatosPracticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
