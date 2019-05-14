import { TestBed } from '@angular/core/testing';

import { ScanditService } from './scandit.service';

describe('ScanditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScanditService = TestBed.get(ScanditService);
    expect(service).toBeTruthy();
  });
});
