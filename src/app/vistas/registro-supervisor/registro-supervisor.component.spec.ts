import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroSupervisorComponent } from './registro-supervisor.component';

describe('RegistroSupervisorComponent', () => {
  let component: RegistroSupervisorComponent;
  let fixture: ComponentFixture<RegistroSupervisorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroSupervisorComponent]
    });
    fixture = TestBed.createComponent(RegistroSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
