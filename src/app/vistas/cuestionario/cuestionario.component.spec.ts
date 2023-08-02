import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuestionarioComponent } from './cuestionario.component';

describe('CuestionarioComponent', () => {
  let component: CuestionarioComponent;
  let fixture: ComponentFixture<CuestionarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuestionarioComponent]
    });
    fixture = TestBed.createComponent(CuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
