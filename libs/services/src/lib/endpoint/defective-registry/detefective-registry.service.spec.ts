import { TestBed } from '@angular/core/testing';

import { DetefectiveRegistryService } from './predistributions.service';

describe('PredistributionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DetefectiveRegistryService = TestBed.get(DetefectiveRegistryService);
    expect(service).toBeTruthy();
  });
});
