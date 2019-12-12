import { TestBed } from '@angular/core/testing';

import { PredistributionsService } from './predistributions.service';

describe('PredistributionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PredistributionsService = TestBed.get(PredistributionsService);
    expect(service).toBeTruthy();
  });
});
