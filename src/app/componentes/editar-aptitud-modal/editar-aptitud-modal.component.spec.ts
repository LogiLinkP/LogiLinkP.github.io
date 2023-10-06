import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAptitudModalComponent } from './editar-aptitud-modal.component';

describe('EditarAptitudModalComponent', () => {
  let component: EditarAptitudModalComponent;
  let fixture: ComponentFixture<EditarAptitudModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarAptitudModalComponent]
    });
    fixture = TestBed.createComponent(EditarAptitudModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
