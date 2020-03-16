import { TestBed } from '@angular/core/testing';

import { StatesExpeditionAvelonProvider } from './states-expedition-avelon.provider';

describe('ReceptionAvelonProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatesExpeditionAvelonProvider = TestBed.get(StatesExpeditionAvelonProvider);
    expect(service).toBeTruthy();
  });
});
