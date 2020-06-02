import { TestBed } from '@angular/core/testing';

import { PackageHistoryService } from './package-history.service';

describe('PackageHistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PackageHistoryService = TestBed.get(PackageHistoryService);
    expect(service).toBeTruthy();
  });
});
