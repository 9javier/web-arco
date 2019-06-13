import { TestBed } from '@angular/core/testing';

import { SetWorkwaveAliveService } from './set-workwave-alive.service';

describe('SetWorkwaveAliveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetWorkwaveAliveService = TestBed.get(SetWorkwaveAliveService);
    expect(service).toBeTruthy();
  });
});
