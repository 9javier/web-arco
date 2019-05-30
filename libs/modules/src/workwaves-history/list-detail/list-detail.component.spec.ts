import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDetailHistoryComponent } from './list-detail.component';

describe('ListDetailHistoryComponent', () => {
  let component: ListDetailHistoryComponent;
  let fixture: ComponentFixture<ListDetailHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDetailHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDetailHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
