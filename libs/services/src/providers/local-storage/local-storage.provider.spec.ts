import { TestBed } from '@angular/core/testing';

import { LocalStorageProvider } from './local-storage.provider';

describe('LocalStorageProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalStorageProvider = TestBed.get(LocalStorageProvider);
    expect(service).toBeTruthy();
  });
});
