import { TestBed } from '@angular/core/testing';

import { PackingInventoryService } from './packing-inventory.service';

describe('PackingInventoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PackingInventoryService = TestBed.get(PackingInventoryService);
    expect(service).toBeTruthy();
  });
});
