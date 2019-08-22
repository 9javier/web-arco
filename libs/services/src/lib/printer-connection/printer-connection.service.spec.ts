import { TestBed } from '@angular/core/testing';

import { PrinterConnectionService } from './printer-connection.service';

describe('PrinterConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrinterConnectionService = TestBed.get(PrinterConnectionService);
    expect(service).toBeTruthy();
  });
});
