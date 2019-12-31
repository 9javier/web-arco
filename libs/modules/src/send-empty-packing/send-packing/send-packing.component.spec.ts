import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SendPackingComponent } from './send-packing.component';

describe('SendPackingComponent', () => {
  let component: SendPackingComponent;
  let fixture: ComponentFixture<SendPackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendPackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
