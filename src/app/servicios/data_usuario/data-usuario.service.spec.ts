import { TestBed } from '@angular/core/testing';

import { DataUsuarioService } from './data-usuario.service';

describe('DataUsuarioService', () => {
  let service: DataUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
