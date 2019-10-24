import { TestBed } from '@angular/core/testing';

import { SorterOutputService } from './sorter-output.service';

describe('SorterOutputService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SorterOutputService = TestBed.get(SorterOutputService);
    expect(service).toBeTruthy();
  });
});
