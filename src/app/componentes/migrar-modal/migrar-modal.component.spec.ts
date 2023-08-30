import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrarModalComponent } from './migrar-modal.component';

describe('MigrarModalComponent', () => {
  let component: MigrarModalComponent;
  let fixture: ComponentFixture<MigrarModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MigrarModalComponent]
    });
    fixture = TestBed.createComponent(MigrarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
