import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWorkwavesHistoryComponent } from './list.component';

describe('ListWorkwavesHistoryComponent', () => {
  let component: ListWorkwavesHistoryComponent;
  let fixture: ComponentFixture<ListWorkwavesHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWorkwavesHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWorkwavesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
