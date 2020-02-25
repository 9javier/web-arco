import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterItemsListComponent } from './filter-items-list.component';

describe('FilterItemsListComponent', () => {
  let component: FilterItemsListComponent;
  let fixture: ComponentFixture<FilterItemsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterItemsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
