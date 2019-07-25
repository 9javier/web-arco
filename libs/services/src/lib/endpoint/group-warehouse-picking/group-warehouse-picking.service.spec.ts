import { TestBed } from '@angular/core/testing';

import { GroupWarehousePickingService } from './group-warehouse-picking.service';

describe('GroupWarehousePickingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GroupWarehousePickingService = TestBed.get(GroupWarehousePickingService);
    expect(service).toBeTruthy();
  });
});
