import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDestinyComponent } from './add-destiny.component';

describe('AddDestinyComponent', () => {
  let component: AddDestinyComponent;
  let fixture: ComponentFixture<AddDestinyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDestinyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDestinyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
