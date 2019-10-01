import { TestBed } from '@angular/core/testing';

import { TransferPackingScanditService } from './transfer-packing.service';

describe('TransferPackingScanditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransferPackingScanditService = TestBed.get(TransferPackingScanditService);
    expect(service).toBeTruthy();
  });
});
