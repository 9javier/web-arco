import { TestBed } from '@angular/core/testing';

import { SorterInputService } from './sorter-input.service';

describe('SorterInputService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SorterInputService = TestBed.get(SorterInputService);
    expect(service).toBeTruthy();
  });
});
