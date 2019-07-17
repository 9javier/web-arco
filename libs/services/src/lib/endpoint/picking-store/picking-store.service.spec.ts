import { TestBed } from '@angular/core/testing';

import { PickingStoreService } from './picking-store.service';

describe('PickingStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PickingStoreService = TestBed.get(PickingStoreService);
    expect(service).toBeTruthy();
  });
});
