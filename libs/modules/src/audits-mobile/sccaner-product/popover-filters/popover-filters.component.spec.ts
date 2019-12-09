import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverFiltersComponent } from './popover-filters.component';

describe('PopoverFiltersComponent', () => {
  let component: PopoverFiltersComponent;
  let fixture: ComponentFixture<PopoverFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
