import { TestBed } from '@angular/core/testing';

import { ReceptionAvelonProvider } from './reception-avelon.provider';

describe('ReceptionAvelonProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReceptionAvelonProvider = TestBed.get(ReceptionAvelonProvider);
    expect(service).toBeTruthy();
  });
});
