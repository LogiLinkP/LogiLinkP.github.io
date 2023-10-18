import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentariosModalComponent } from './comentarios-modal.component';

describe('ComentariosModalComponent', () => {
  let component: ComentariosModalComponent;
  let fixture: ComponentFixture<ComentariosModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComentariosModalComponent]
    });
    fixture = TestBed.createComponent(ComentariosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
