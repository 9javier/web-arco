import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertPopoverComponent } from './alert-popover.component';

describe('AlertPopoverComponent', () => {
  let component: AlertPopoverComponent;
  let fixture: ComponentFixture<AlertPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
