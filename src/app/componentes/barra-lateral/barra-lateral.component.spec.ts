import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraLateralComponent } from './barra-lateral.component';

describe('BarraLateralComponent', () => {
  let component: BarraLateralComponent;
  let fixture: ComponentFixture<BarraLateralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BarraLateralComponent]
    });
    fixture = TestBed.createComponent(BarraLateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
