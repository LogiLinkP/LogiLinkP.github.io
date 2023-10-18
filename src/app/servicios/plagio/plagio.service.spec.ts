import { TestBed } from '@angular/core/testing';

import { PlagioService } from './plagio.service';

describe('PlagioService', () => {
  let service: PlagioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlagioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
