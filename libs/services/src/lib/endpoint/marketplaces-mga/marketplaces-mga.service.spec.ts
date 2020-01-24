import { TestBed } from '@angular/core/testing';

import { MarketplacesMgaService } from './marketplaces-mga.service';

describe('MarketplacesMgaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MarketplacesMgaService = TestBed.get(MarketplacesMgaService);
    expect(service).toBeTruthy();
  });
});
