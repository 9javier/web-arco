import { TestBed } from '@angular/core/testing';

import { MarketplacesService } from './marketplaces.service';

describe('MarketplacesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MarketplacesService = TestBed.get(MarketplacesService);
    expect(service).toBeTruthy();
  });
});
