import { TestBed } from '@angular/core/testing';

import { StorageUserService } from './storage-user.service';

describe('StorageUserService', () => {
  let service: StorageUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
