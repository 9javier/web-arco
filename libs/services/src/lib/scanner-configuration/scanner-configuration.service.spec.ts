import { TestBed } from '@angular/core/testing';

import { ScannerConfigurationService } from './scanner-configuration.service';

describe('ScannerConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScannerConfigurationService = TestBed.get(ScannerConfigurationService);
    expect(service).toBeTruthy();
  });
});
