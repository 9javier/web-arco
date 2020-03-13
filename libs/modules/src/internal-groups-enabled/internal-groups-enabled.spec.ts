import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalGroupsEnabledComponent } from './internal-groups-enabled.component';

describe('SeasonsEnabledComponent', () => {
  let component: InternalGroupsEnabledComponent;
  let fixture: ComponentFixture<InternalGroupsEnabledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InternalGroupsEnabledComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalGroupsEnabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
