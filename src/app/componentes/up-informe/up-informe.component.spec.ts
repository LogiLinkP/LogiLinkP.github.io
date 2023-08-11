import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpInformeComponent } from './up-informe.component';

describe('UpInformeComponent', () => {
  let component: UpInformeComponent;
  let fixture: ComponentFixture<UpInformeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpInformeComponent]
    });
    fixture = TestBed.createComponent(UpInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
