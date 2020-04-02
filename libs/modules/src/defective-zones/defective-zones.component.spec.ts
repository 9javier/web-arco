import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectiveZonesComponent } from './defective-zones.component';

describe('DefectiveZonesComponent', () => {
  let component: DefectiveZonesComponent;
  let fixture: ComponentFixture<DefectiveZonesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefectiveZonesComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectiveZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
