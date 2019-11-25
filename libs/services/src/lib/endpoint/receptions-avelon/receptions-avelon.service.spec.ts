import { TestBed } from '@angular/core/testing';

import { ReceptionsAvelonService } from './receptions-avelon.service';

describe('ReceptionsAvelonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReceptionsAvelonService = TestBed.get(ReceptionsAvelonService);
    expect(service).toBeTruthy();
  });
});
