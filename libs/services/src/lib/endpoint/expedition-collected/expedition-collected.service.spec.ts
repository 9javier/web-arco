import { TestBed } from '@angular/core/testing';

import { ExpeditionCollectedService } from  './expedition-collected.service';

describe('PredistributionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExpeditionCollectedService = TestBed.get(ExpeditionCollectedService);
    expect(service).toBeTruthy();
  });
});
