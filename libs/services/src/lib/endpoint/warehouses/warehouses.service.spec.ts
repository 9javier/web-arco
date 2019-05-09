import { TestBed } from '@angular/core/testing';

import { WarehousesService } from './warehouses.service';

describe('WarehousesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WarehousesService = TestBed.get(WarehousesService);
    expect(service).toBeTruthy();
  });
});
