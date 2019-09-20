import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverListStoresComponent } from './popover-list-stores.component';

describe('PopoverListStoresComponent', () => {
  let component: PopoverListStoresComponent;
  let fixture: ComponentFixture<PopoverListStoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverListStoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverListStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
