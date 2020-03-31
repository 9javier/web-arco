import { TestBed } from '@angular/core/testing';

import { DefectiveZonesService } from './group-warehouse-picking.service';

describe('GroupWarehousePickingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DefectiveZonesService = TestBed.get(DefectiveZonesService);
    expect(service).toBeTruthy();
  });
});
