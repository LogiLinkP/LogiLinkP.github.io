import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionPracticaExistenteComponent } from './configuracion-practica-existente.component';

describe('ConfiguracionPracticaExistenteComponent', () => {
  let component: ConfiguracionPracticaExistenteComponent;
  let fixture: ComponentFixture<ConfiguracionPracticaExistenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfiguracionPracticaExistenteComponent]
    });
    fixture = TestBed.createComponent(ConfiguracionPracticaExistenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
