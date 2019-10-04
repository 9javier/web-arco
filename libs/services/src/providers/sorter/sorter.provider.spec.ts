import { TestBed } from '@angular/core/testing';

import { SorterProvider } from './sorter.provider';

describe('SorterProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SorterProvider = TestBed.get(SorterProvider);
    expect(service).toBeTruthy();
  });
});
