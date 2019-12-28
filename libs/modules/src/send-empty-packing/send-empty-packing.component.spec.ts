import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmptyPackingComponent } from './send-empty-packing.component';

describe('JailComponent', () => {
  let component: SendEmptyPackingComponent;
  let fixture: ComponentFixture<SendEmptyPackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendEmptyPackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendEmptyPackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
