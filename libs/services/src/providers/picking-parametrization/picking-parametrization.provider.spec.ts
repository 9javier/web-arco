import { TestBed } from '@angular/core/testing';

import { PickingParametrizationProvider } from './picking-parametrization.provider';

describe('PickingParametrizationProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PickingParametrizationProvider = TestBed.get(PickingParametrizationProvider);
    expect(service).toBeTruthy();
  });
});
