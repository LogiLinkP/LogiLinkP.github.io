import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaSupervisorComponent } from './vista-supervisor.component';

describe('VistaSupervisorComponent', () => {
  let component: VistaSupervisorComponent;
  let fixture: ComponentFixture<VistaSupervisorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaSupervisorComponent]
    });
    fixture = TestBed.createComponent(VistaSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
