import { TestBed } from '@angular/core/testing';

import { SeasonsEnabledService } from './seasons-enabled.service';

describe('SeasonsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SeasonsEnabledService = TestBed.get(SeasonsEnabledService);
    expect(service).toBeTruthy();
  });
});
