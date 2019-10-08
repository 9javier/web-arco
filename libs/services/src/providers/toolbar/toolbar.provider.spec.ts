import { TestBed } from '@angular/core/testing';

import { ToolbarProvider } from './toolbar.provider';

describe('ToolbarProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToolbarProvider = TestBed.get(ToolbarProvider);
    expect(service).toBeTruthy();
  });
});
