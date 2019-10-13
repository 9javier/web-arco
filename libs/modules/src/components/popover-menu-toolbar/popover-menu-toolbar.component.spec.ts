import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverMenuToolbarComponent } from './popover-menu-toolbar.component';

describe('PopoverMenuToolbarComponent', () => {
  let component: PopoverMenuToolbarComponent;
  let fixture: ComponentFixture<PopoverMenuToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverMenuToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverMenuToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
