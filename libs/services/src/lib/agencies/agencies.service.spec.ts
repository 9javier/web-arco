import { TestBed } from '@angular/core/testing';

import { AgenciesService } from './agencies.service';

describe('AgenciesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AgenciesService = TestBed.get(AgenciesService);
    expect(service).toBeTruthy();
  });
});
