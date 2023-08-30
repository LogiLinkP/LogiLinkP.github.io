import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionPracticaComponent } from './configuracion-practica.component';

describe('ConfiguracionPracticaComponent', () => {
  let component: ConfiguracionPracticaComponent;
  let fixture: ComponentFixture<ConfiguracionPracticaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfiguracionPracticaComponent]
    });
    fixture = TestBed.createComponent(ConfiguracionPracticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
