import { TestBed } from '@angular/core/testing';

import { WorkwavesService } from './workwaves.service';

describe('WorkwavesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkwavesService = TestBed.get(WorkwavesService);
    expect(service).toBeTruthy();
  });
});
