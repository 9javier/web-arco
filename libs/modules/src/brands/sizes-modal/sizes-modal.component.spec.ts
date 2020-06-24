import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeModalComponent } from './sizes-modal.component';

describe('ShowDestinationsComponent', () => {
  let component: SizeModalComponent;
  let fixture: ComponentFixture<SizeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SizeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
