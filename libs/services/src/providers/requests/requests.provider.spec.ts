import { TestBed } from '@angular/core/testing';

import { RequestsProvider } from './requests.provider';

describe('RequestsProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequestsProvider = TestBed.get(RequestsProvider);
    expect(service).toBeTruthy();
  });
});
