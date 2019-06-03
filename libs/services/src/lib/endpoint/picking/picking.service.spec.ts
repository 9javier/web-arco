import { TestBed } from '@angular/core/testing';

import { PickingService } from './picking.service';

describe('PickingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PickingService = TestBed.get(PickingService);
    expect(service).toBeTruthy();
  });
});
