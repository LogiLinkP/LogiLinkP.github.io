import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirArchivoInformeFinalComponent } from './subir-archivo-informe-final.component';

describe('SubirArchivoInformeFinalComponent', () => {
  let component: SubirArchivoInformeFinalComponent;
  let fixture: ComponentFixture<SubirArchivoInformeFinalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubirArchivoInformeFinalComponent]
    });
    fixture = TestBed.createComponent(SubirArchivoInformeFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
