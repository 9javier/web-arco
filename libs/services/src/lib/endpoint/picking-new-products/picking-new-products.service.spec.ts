import { TestBed } from '@angular/core/testing';

import { PickingNewProductsService } from './picking-new-products.service';

describe('PickingNewProductsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PickingNewProductsService = TestBed.get(PickingNewProductsService);
    expect(service).toBeTruthy();
  });
});
