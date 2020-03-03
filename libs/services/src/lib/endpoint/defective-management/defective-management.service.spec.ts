import { TestBed } from '@angular/core/testing';

import { DefectiveManagementService } from './group-warehouse-picking.service';

describe('GroupWarehousePickingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DefectiveManagementService = TestBed.get(DefectiveManagementService);
    expect(service).toBeTruthy();
  });
});
