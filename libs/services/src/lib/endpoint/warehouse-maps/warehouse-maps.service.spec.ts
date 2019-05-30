import { TestBed } from '@angular/core/testing';

import { WarehouseMapsService } from './warehouse-maps.service';

describe('WarehouseMapsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WarehouseMapsService = TestBed.get(WarehouseMapsService);
    expect(service).toBeTruthy();
  });
});
