import { TestBed } from '@angular/core/testing';

import { PickingStoreOnlineScanditService } from './pickingStoreOnline.service';

describe('PickingStoreOnlineScanditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PickingStoreOnlineScanditService = TestBed.get(PickingStoreOnlineScanditService);
    expect(service).toBeTruthy();
  });
});
