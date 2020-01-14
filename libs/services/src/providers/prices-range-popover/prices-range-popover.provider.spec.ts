import { TestBed } from '@angular/core/testing';

import { PricesRangePopoverProvider } from './prices-range-popover.provider';

describe('PricesRangePopoverProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PricesRangePopoverProvider = TestBed.get(PricesRangePopoverProvider);
    expect(service).toBeTruthy();
  });
});
