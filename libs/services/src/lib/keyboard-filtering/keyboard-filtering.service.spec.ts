import { TestBed } from '@angular/core/testing';

import { KeyboardFilteringService } from './keyboard-filtering.service';

describe('KeyboardFilteringService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KeyboardFilteringService = TestBed.get(KeyboardFilteringService);
    expect(service).toBeTruthy();
  });
});
