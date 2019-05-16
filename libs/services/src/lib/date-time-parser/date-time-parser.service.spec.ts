import { TestBed } from '@angular/core/testing';

import { DateTimeParserService } from './date-time-parser.service';

describe('DateTimeParserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DateTimeParserService = TestBed.get(DateTimeParserService);
    expect(service).toBeTruthy();
  });
});
