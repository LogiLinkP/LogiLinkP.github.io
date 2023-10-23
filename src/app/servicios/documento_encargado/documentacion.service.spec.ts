import { TestBed } from '@angular/core/testing';

import { DocumentacionService } from './documentacion.service';

describe('DocumentacionService', () => {
  let service: DocumentacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
