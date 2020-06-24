import { TestBed } from '@angular/core/testing';

import { CarrierService } from './customers.service';

describe('CarrierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CarrierService = TestBed.get(CarrierService);
    expect(service).toBeTruthy();
  });
});
