import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReturnTrackingListComponent } from './return-tracking-list.component';

describe('ReturnTrackingListComponent', () => {
  let component: ReturnTrackingListComponent;
  let fixture: ComponentFixture<ReturnTrackingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnTrackingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnTrackingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
