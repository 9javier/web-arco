import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReturnPendingListComponent } from './return-pending-list.component';

describe('ReturnPendingListComponent', () => {
  let component: ReturnPendingListComponent;
  let fixture: ComponentFixture<ReturnPendingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnPendingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnPendingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
