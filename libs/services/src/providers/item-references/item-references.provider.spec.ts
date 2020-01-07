import { TestBed } from '@angular/core/testing';

import { ItemReferencesProvider } from './item-references.provider';

describe('ItemReferencesProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ItemReferencesProvider = TestBed.get(ItemReferencesProvider);
    expect(service).toBeTruthy();
  });
});
