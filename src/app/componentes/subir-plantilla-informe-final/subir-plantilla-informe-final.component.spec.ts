import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirPlantillaInformeFinalComponent } from './subir-plantilla-informe-final.component';

describe('SubirPlantillaInformeFinalComponent', () => {
  let component: SubirPlantillaInformeFinalComponent;
  let fixture: ComponentFixture<SubirPlantillaInformeFinalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubirPlantillaInformeFinalComponent]
    });
    fixture = TestBed.createComponent(SubirPlantillaInformeFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
