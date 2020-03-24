import { TestBed } from '@angular/core/testing';

import { IncidencesReceptionService } from './incidences-reception.service';

describe('IncidencesReceptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IncidencesReceptionService = TestBed.get(IncidencesReceptionService);
    expect(service).toBeTruthy();
  });
});
