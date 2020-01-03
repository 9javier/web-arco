import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SendPackingManualComponent } from './send-packing-manual.component';

describe('SendPackingComponent', () => {
  let component: SendPackingManualComponent;
  let fixture: ComponentFixture<SendPackingManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendPackingManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPackingManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
