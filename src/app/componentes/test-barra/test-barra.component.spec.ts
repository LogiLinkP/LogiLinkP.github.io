import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestBarraComponent } from './test-barra.component';

describe('TestBarraComponent', () => {
  let component: TestBarraComponent;
  let fixture: ComponentFixture<TestBarraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestBarraComponent]
    });
    fixture = TestBed.createComponent(TestBarraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
