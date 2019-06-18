import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitlePickingHistoryComponent } from './title.component';

describe('TitlePickingHistoryComponent', () => {
  let component: TitlePickingHistoryComponent;
  let fixture: ComponentFixture<TitlePickingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitlePickingHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitlePickingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
