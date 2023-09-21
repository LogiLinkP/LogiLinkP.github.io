import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoInformeComponent } from './ingreso-informe.component';

describe('IngresoInformeComponent', () => {
  let component: IngresoInformeComponent;
  let fixture: ComponentFixture<IngresoInformeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngresoInformeComponent]
    });
    fixture = TestBed.createComponent(IngresoInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
