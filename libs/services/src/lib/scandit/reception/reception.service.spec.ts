import { TestBed } from '@angular/core/testing';

import { ReceptionScanditService } from './reception.service';

describe('ReceptionScanditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReceptionScanditService = TestBed.get(ReceptionScanditService);
    expect(service).toBeTruthy();
  });
});
