import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleListWorkwavesScheduleComponent } from './list-title.component';

describe('TitleListWorkwavesScheduleComponent', () => {
  let component: TitleListWorkwavesScheduleComponent;
  let fixture: ComponentFixture<TitleListWorkwavesScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleListWorkwavesScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleListWorkwavesScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
