import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PickingReturnComponent } from './picking-return.component';

describe('PickingReturnComponent', () => {
  let component: PickingReturnComponent;
  let fixture: ComponentFixture<PickingReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PickingReturnComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickingReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
