import { TestBed } from '@angular/core/testing';

import { ProductsAvelonService } from './products-avelon.service';

describe('ProductsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductsAvelonService = TestBed.get(ProductsAvelonService);
    expect(service).toBeTruthy();
  });
});
