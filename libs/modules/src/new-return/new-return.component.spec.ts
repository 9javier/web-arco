import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewReturnComponent } from './new-return.component';

describe('NewReturnComponent', () => {
  let component: NewReturnComponent;
  let fixture: ComponentFixture<NewReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
