import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FragmentosComponent } from './fragmentos.component';

describe('FragmentosComponent', () => {
  let component: FragmentosComponent;
  let fixture: ComponentFixture<FragmentosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FragmentosComponent]
    });
    fixture = TestBed.createComponent(FragmentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
