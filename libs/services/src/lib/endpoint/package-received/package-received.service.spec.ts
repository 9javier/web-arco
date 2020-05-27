import { TestBed } from '@angular/core/testing';

import { PackageReceivedService } from './package-received.service';

describe('PackageReceivedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PackageReceivedService = TestBed.get(PackageReceivedService);
    expect(service).toBeTruthy();
  });
});
