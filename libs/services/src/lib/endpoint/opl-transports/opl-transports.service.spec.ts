import { TestBed } from '@angular/core/testing';

import { OplTransportsService } from './opl-transports.service';

describe('OplTransportsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OplTransportsService = TestBed.get(OplTransportsService);
    expect(service).toBeTruthy();
  });
});
