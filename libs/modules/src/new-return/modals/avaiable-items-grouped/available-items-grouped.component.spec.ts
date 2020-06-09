import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableItemsGroupedComponent } from './available-items-grouped.component';

describe('AvailableItemsGroupedComponent', () => {
  let component: AvailableItemsGroupedComponent;
  let fixture: ComponentFixture<AvailableItemsGroupedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableItemsGroupedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableItemsGroupedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
