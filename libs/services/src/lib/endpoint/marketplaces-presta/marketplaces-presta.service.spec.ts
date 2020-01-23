import { TestBed } from '@angular/core/testing';

import { MarketplacesPrestaService } from './marketplaces-presta.service';

describe('MarketplacesPrestaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MarketplacesPrestaService = TestBed.get(MarketplacesPrestaService);
    expect(service).toBeTruthy();
  });
});
