import { TestBed } from '@angular/core/testing';

import { UsuarioSupervisorService } from './usuario-supervisor.service';

describe('UsuarioSupervisorService', () => {
  let service: UsuarioSupervisorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioSupervisorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
