import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportManifestComponent } from './transport-manifest.component';

describe('DefectiveRegistryComponent', () => {
  let component: TransportManifestComponent;
  let fixture: ComponentFixture<TransportManifestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportManifestComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportManifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
