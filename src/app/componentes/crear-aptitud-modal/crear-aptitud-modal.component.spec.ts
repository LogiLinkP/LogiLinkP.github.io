import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearAptitudModalComponent } from './crear-aptitud-modal.component';

describe('CrearAptitudModalComponent', () => {
  let component: CrearAptitudModalComponent;
  let fixture: ComponentFixture<CrearAptitudModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearAptitudModalComponent]
    });
    fixture = TestBed.createComponent(CrearAptitudModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
