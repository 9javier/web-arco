import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonsEnabledComponent } from './seasons-enabled.component';

describe('SeasonsEnabledComponent', () => {
  let component: SeasonsEnabledComponent;
  let fixture: ComponentFixture<SeasonsEnabledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeasonsEnabledComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonsEnabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
