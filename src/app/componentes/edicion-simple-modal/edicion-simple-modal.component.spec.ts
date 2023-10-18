import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicionSimpleModalComponent } from './edicion-simple-modal.component';

describe('EdicionSimpleModalComponent', () => {
  let component: EdicionSimpleModalComponent;
  let fixture: ComponentFixture<EdicionSimpleModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EdicionSimpleModalComponent]
    });
    fixture = TestBed.createComponent(EdicionSimpleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
