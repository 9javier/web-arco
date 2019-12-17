import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredistributionsComponent } from './predistributions.component';

describe('PredistributionsComponent', () => {
  let component: PredistributionsComponent;
  let fixture: ComponentFixture<PredistributionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredistributionsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredistributionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
