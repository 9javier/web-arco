import { TestBed } from '@angular/core/testing';

import { StateExpeditionAvelonService } from './state-expedition-avelon.service';

describe('StateExpeditionAvelonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StateExpeditionAvelonService = TestBed.get(StateExpeditionAvelonService);
    expect(service).toBeTruthy();
  });
});
