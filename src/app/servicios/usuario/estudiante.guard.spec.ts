import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { estudianteGuard } from './estudiante.guard';

describe('estudianteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => estudianteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
