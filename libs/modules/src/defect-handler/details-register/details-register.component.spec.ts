import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsRegisterComponent  } from './details-register.component'

describe('ProductDetailsComponent', () => {
  let component: DetailsRegisterComponent;
  let fixture: ComponentFixture<DetailsRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
