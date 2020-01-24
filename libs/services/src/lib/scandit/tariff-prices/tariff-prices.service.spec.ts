import { TestBed } from '@angular/core/testing';
import { TariffPricesScanditService } from './tariff-prices.service';

describe('TariffPricesScanditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TariffPricesScanditService = TestBed.get(TariffPricesScanditService);
    expect(service).toBeTruthy();
  });
});
