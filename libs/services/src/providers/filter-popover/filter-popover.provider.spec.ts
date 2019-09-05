import { TestBed } from '@angular/core/testing';

import { FilterPopoverProvider } from './filter-popover.provider';

describe('FilterPopoverProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilterPopoverProvider = TestBed.get(FilterPopoverProvider);
    expect(service).toBeTruthy();
  });
});
