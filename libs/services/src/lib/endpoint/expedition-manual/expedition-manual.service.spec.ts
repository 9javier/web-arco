import { TestBed } from '@angular/core/testing';

import { ExpeditionManualService } from './expedition-manual.service';

describe('PredistributionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExpeditionManualService = TestBed.get(ExpeditionManualService);
    expect(service).toBeTruthy();
  });
});
