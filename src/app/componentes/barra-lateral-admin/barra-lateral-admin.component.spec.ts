import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraLateralAdminComponent } from './barra-lateral-admin.component';

describe('BarraLateralAdminComponent', () => {
  let component: BarraLateralAdminComponent;
  let fixture: ComponentFixture<BarraLateralAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BarraLateralAdminComponent]
    });
    fixture = TestBed.createComponent(BarraLateralAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
