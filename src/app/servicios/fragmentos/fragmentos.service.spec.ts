import { TestBed } from '@angular/core/testing';

import { FragmentosService } from '../fragmentos/fragmentos.service';

describe('FragmentosService', () => {
  let service: FragmentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FragmentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
