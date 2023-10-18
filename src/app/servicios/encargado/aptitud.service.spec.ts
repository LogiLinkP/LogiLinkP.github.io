import { TestBed } from '@angular/core/testing';

import { AptitudService } from './aptitud.service';

describe('AptitudService', () => {
  let service: AptitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AptitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
