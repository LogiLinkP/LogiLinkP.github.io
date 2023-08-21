import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { supervisorGuard } from './supervisor.guard';

describe('supervisorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => supervisorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
