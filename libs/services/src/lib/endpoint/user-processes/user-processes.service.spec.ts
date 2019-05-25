import { TestBed } from '@angular/core/testing';

import { UserProcessesService } from './user-processes.service';

describe('UserProcessesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserProcessesService = TestBed.get(UserProcessesService);
    expect(service).toBeTruthy();
  });
});
