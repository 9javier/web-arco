import { TestBed } from '@angular/core/testing';

import { UserTimeService } from './user-time.service';

describe('UserTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserTimeService = TestBed.get(UserTimeService);
    expect(service).toBeTruthy();
  });
});
