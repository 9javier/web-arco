import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SorterInfoWayEmptyingComponent } from './info-way.component';

describe('SorterInfoWayEmptyingComponent', () => {
  let component: SorterInfoWayEmptyingComponent;
  let fixture: ComponentFixture<SorterInfoWayEmptyingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SorterInfoWayEmptyingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SorterInfoWayEmptyingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
