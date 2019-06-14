import { TestBed } from '@angular/core/testing';

import { PickingProvider } from './picking.provider';

describe('PickingProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PickingProvider = TestBed.get(PickingProvider);
    expect(service).toBeTruthy();
  });
});
