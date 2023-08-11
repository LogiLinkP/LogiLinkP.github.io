import { TestBed } from '@angular/core/testing';

import { NotisChatService } from './notis-chat.service';

describe('NotisChatService', () => {
  let service: NotisChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotisChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
