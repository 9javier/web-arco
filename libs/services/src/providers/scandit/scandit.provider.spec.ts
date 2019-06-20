import { TestBed } from '@angular/core/testing';

import { ScanditProvider } from './scandit.provider';

describe('ScanditProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScanditProvider = TestBed.get(ScanditProvider);
    expect(service).toBeTruthy();
  });
});
