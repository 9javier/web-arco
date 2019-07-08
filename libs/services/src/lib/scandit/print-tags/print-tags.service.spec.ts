import { TestBed } from '@angular/core/testing';

import { PrintTagsScanditService } from './print-tags.service';

describe('PrintTagsScanditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrintTagsScanditService = TestBed.get(PrintTagsScanditService);
    expect(service).toBeTruthy();
  });
});
