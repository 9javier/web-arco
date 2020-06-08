import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMappingComponent } from './create-mapping.component';

describe('CreateMappingComponent', () => {
  let component: CreateMappingComponent;
  let fixture: ComponentFixture<CreateMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
