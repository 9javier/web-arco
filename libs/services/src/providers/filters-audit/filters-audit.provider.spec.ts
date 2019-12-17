import { TestBed } from '@angular/core/testing';

import { FiltersAuditProvider } from './filters-audit.provider';

describe('FiltersAuditProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FiltersAuditProvider = TestBed.get(FiltersAuditProvider);
    expect(service).toBeTruthy();
  });
});
