import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {NewOperatorRuleComponent} from "./new-operator-rule.component";

describe('NewOperatorRuleComponent', () => {
  let component: NewOperatorRuleComponent;
  let fixture: ComponentFixture<NewOperatorRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewOperatorRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOperatorRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
