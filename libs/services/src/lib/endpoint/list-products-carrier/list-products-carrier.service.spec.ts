import { TestBed } from '@angular/core/testing';

import { ListProductsCarrierService } from './list-products-carrier.service';

describe('ListProductsCarrierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListProductsCarrierService = TestBed.get(ListProductsCarrierService);
    expect(service).toBeTruthy();
  });
});
