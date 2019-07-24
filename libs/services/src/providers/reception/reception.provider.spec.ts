import { TestBed } from '@angular/core/testing';

import { ReceptionProvider } from './reception.provider';

describe('ReceptionProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReceptionProvider = TestBed.get(ReceptionProvider);
    expect(service).toBeTruthy();
  });
});
