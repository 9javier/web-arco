import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationActiveProcessSorterComponent } from './notification-active-process.component';

describe('NotificationActiveProcessSorterComponent', () => {
  let component: NotificationActiveProcessSorterComponent;
  let fixture: ComponentFixture<NotificationActiveProcessSorterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationActiveProcessSorterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationActiveProcessSorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
