import { TestBed } from '@angular/core/testing';

import { WarehouseGroupService } from './warehouse-group.service';

describe('WarehouseGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WarehouseGroupService = TestBed.get(WarehouseGroupService);
    expect(service).toBeTruthy();
  });
});
