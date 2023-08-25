import { TestBed } from '@angular/core/testing';

import { InformeService } from './informe.service';

describe('InformeService', () => {
  let service: InformeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
