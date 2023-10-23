import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentacionComponent } from './documentacion.component';

describe('DocumentacionComponent', () => {
  let component: DocumentacionComponent;
  let fixture: ComponentFixture<DocumentacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentacionComponent]
    });
    fixture = TestBed.createComponent(DocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
