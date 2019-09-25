import { TestBed } from '@angular/core/testing';

import { AppFiltersService } from './app-filters.service';

describe('AppFiltersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppFiltersService = TestBed.get(AppFiltersService);
    expect(service).toBeTruthy();
  });
});
