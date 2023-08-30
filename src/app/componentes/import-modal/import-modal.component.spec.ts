import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportModalComponent } from './import-modal.component';

describe('ImportModalComponent', () => {
  let component: ImportModalComponent;
  let fixture: ComponentFixture<ImportModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportModalComponent]
    });
    fixture = TestBed.createComponent(ImportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
