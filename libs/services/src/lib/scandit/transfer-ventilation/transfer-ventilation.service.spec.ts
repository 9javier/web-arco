import { TestBed } from '@angular/core/testing';

import { TransferVentilationScanditService } from './transfer-ventilation.service';

describe('TransferVentilationScanditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransferVentilationScanditService = TestBed.get(TransferVentilationScanditService);
    expect(service).toBeTruthy();
  });
});
