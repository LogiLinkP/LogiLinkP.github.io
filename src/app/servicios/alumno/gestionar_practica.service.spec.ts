import { TestBed } from '@angular/core/testing';

import { GestionarService } from './gestionar_practica.service';

describe('GestionarService', () => {
  let service: GestionarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
