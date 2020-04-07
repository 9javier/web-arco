import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListManualComponent } from './list-manual.component';

describe('ProductsAvelonComponent', () => {
  let component: ListManualComponent;
  let fixture: ComponentFixture<ListManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListManualComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
