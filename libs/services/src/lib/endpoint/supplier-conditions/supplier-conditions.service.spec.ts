import { TestBed } from '@angular/core/testing';

import { SupplierConditionsService } from './supplier-conditions.service';

describe('SupplierConditionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupplierConditionsService = TestBed.get(SupplierConditionsService);
    expect(service).toBeTruthy();
  });
});
