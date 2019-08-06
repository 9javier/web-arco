import { TestBed } from '@angular/core/testing';

import { ProductInfoScanditService } from './product-info.service';

describe('ProductInfoScanditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductInfoScanditService = TestBed.get(ProductInfoScanditService);
    expect(service).toBeTruthy();
  });
});
