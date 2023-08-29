import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotisHistorialComponent } from './notis-historial.component';

describe('NotisHistorialComponent', () => {
  let component: NotisHistorialComponent;
  let fixture: ComponentFixture<NotisHistorialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotisHistorialComponent]
    });
    fixture = TestBed.createComponent(NotisHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
