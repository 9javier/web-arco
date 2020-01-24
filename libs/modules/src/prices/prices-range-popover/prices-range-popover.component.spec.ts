import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricesRangePopoverComponent } from './prices-range-popover.component';

describe('PricesRangePopoverComponent', () => {
  let component: PricesRangePopoverComponent;
  let fixture: ComponentFixture<PricesRangePopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricesRangePopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricesRangePopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
