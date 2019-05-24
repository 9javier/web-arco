import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWorkwavesScheduleComponent } from './list.component';

describe('ListWorkwavesScheduleComponent', () => {
  let component: ListWorkwavesScheduleComponent;
  let fixture: ComponentFixture<ListWorkwavesScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWorkwavesScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWorkwavesScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
