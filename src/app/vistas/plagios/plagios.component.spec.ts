import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlagiosComponent } from './plagios.component';

describe('PlagiosComponent', () => {
  let component: PlagiosComponent;
  let fixture: ComponentFixture<PlagiosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlagiosComponent]
    });
    fixture = TestBed.createComponent(PlagiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
