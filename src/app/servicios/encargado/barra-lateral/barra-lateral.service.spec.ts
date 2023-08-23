import { TestBed } from '@angular/core/testing';

import { BarraLateralService } from './barra-lateral.service';

describe('BarraLateralService', () => {
  let service: BarraLateralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarraLateralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
