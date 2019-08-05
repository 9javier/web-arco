import { TestBed } from '@angular/core/testing';

import { SealScanditService } from './seal.service';

describe('SealScanditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SealScanditService = TestBed.get(SealScanditService);
    expect(service).toBeTruthy();
  });
});
