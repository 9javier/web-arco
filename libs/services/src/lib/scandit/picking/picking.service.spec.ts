import { TestBed } from '@angular/core/testing';

import { PickingScanditService } from './picking.service';

describe('PickingScanditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PickingScanditService = TestBed.get(PickingScanditService);
    expect(service).toBeTruthy();
  });
});
