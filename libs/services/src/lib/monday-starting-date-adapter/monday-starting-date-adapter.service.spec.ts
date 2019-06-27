import { TestBed } from '@angular/core/testing';

import { MondayStartingDateAdapterService } from './monday-starting-date-adapter.service';

describe('MondayStartingDateAdapterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MondayStartingDateAdapterService = TestBed.get(MondayStartingDateAdapterService);
    expect(service).toBeTruthy();
  });
});
