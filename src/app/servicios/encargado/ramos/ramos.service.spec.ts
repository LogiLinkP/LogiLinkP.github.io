import { TestBed } from '@angular/core/testing';

import { RamosService } from './ramos.service';

describe('RamosService', () => {
  let service: RamosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RamosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
