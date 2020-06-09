import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPopoverComponent } from './view-popover.component';

describe('ViewPopoverComponent', () => {
  let component: ViewPopoverComponent;
  let fixture: ComponentFixture<ViewPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
