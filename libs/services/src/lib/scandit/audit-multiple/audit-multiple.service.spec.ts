import { TestBed } from '@angular/core/testing';

import { AuditMultipleScanditService } from './audit-multiple.service';

describe('AuditMultipleScanditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuditMultipleScanditService = TestBed.get(AuditMultipleScanditService);
    expect(service).toBeTruthy();
  });
});
