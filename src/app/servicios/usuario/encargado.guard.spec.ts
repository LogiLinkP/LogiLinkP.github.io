import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { encargadoGuard } from './encargado.guard';

describe('encargadoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => encargadoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
