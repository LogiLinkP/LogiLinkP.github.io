import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPracticaComponent } from './config-practica.component';

describe('ConfigPracticaComponent', () => {
  let component: ConfigPracticaComponent;
  let fixture: ComponentFixture<ConfigPracticaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigPracticaComponent]
    });
    fixture = TestBed.createComponent(ConfigPracticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
