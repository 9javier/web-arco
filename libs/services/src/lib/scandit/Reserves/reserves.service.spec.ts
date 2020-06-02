import { TestBed } from '@angular/core/testing';
import { ReservesService } from './reserves.service';

describe('ReservesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReservesService = TestBed.get(ReservesService);
    expect(service).toBeTruthy();
  });
});
