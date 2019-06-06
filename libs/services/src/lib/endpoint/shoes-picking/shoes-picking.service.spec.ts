import { TestBed } from '@angular/core/testing';

import { ShoesPickingService } from './shoes-picking.service';

describe('ShoesPickingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShoesPickingService = TestBed.get(ShoesPickingService);
    expect(service).toBeTruthy();
  });
});
