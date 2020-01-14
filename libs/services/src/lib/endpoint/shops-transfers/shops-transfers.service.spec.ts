import { TestBed } from '@angular/core/testing';

import { ShopsTransfersService } from './shops-transfers.service';

describe('ShopsTransfersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShopsTransfersService = TestBed.get(ShopsTransfersService);
    expect(service).toBeTruthy();
  });
});
