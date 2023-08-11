import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirArchivoExtraComponent } from './subir-archivo-extra.component';

describe('SubirArchivoExtraComponent', () => {
  let component: SubirArchivoExtraComponent;
  let fixture: ComponentFixture<SubirArchivoExtraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubirArchivoExtraComponent]
    });
    fixture = TestBed.createComponent(SubirArchivoExtraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
