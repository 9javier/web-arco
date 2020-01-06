import { TestBed } from '@angular/core/testing';

import { NewProductsService } from './new-products.service';

describe('NewProductsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewProductsService = TestBed.get(NewProductsService);
    expect(service).toBeTruthy();
  });
});
