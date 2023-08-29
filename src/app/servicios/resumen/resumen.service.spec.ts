import { TestBed } from '@angular/core/testing';

import { ResumenService } from './resumen.service';

describe('ResumenService', () => {
  let service: ResumenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResumenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
