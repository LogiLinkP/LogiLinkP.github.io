import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionUsuarioComponent } from './confirmacion-usuario.component';

describe('ConfirmacionUsuarioComponent', () => {
  let component: ConfirmacionUsuarioComponent;
  let fixture: ComponentFixture<ConfirmacionUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmacionUsuarioComponent]
    });
    fixture = TestBed.createComponent(ConfirmacionUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
