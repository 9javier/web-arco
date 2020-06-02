import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewReturnUnitiesComponent } from './new-return-unities.component';

describe('NewReturnUnitiesComponent', () => {
  let component: NewReturnUnitiesComponent;
  let fixture: ComponentFixture<NewReturnUnitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewReturnUnitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewReturnUnitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
