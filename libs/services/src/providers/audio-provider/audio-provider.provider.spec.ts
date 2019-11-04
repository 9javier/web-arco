import { TestBed } from '@angular/core/testing';

import { AudioProvider } from './audio-provider.provider';

describe('AudioProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AudioProvider = TestBed.get(AudioProvider);
    expect(service).toBeTruthy();
  });
});
