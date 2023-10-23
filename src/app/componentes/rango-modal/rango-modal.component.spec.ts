import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangoModalComponent } from './rango-modal.component';

describe('RangoModalComponent', () => {
  let component: RangoModalComponent;
  let fixture: ComponentFixture<RangoModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RangoModalComponent]
    });
    fixture = TestBed.createComponent(RangoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
