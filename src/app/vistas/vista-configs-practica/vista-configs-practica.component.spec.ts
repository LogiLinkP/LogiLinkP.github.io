import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaConfigsPracticaComponent } from './vista-configs-practica.component';

describe('VistaConfigsPracticaComponent', () => {
  let component: VistaConfigsPracticaComponent;
  let fixture: ComponentFixture<VistaConfigsPracticaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaConfigsPracticaComponent]
    });
    fixture = TestBed.createComponent(VistaConfigsPracticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
