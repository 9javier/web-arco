import { TestBed } from '@angular/core/testing';

import { SelectScrollbarProvider } from './select-scrollbar.provider';

describe('SelectScrollbarProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectScrollbarProvider = TestBed.get(SelectScrollbarProvider);
    expect(service).toBeTruthy();
  });
});
