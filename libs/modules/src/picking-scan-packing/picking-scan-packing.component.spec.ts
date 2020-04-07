import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PickingScanPackingComponent } from './picking-scan-packing.component';

describe('PickingScanPackingComponent', () => {
  let component: PickingScanPackingComponent;
  let fixture: ComponentFixture<PickingScanPackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickingScanPackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickingScanPackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
