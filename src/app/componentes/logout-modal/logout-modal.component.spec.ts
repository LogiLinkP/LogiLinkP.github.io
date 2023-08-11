import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutModalComponent } from './logout-modal.component';

describe('LogoutModalComponent', () => {
  let component: LogoutModalComponent;
  let fixture: ComponentFixture<LogoutModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogoutModalComponent]
    });
    fixture = TestBed.createComponent(LogoutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
