import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'suite-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  @Input() set zone(zone) {
    if (zone) {
      this.form.patchValue(zone);
    }
  }

  @Input() colors: any;

  form: FormGroup = this.formBuilder.group({
    id: [''],
    name: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder
  ) { }


  getValue() {
    return this.sanitize(this.form.value);
  }

  sanitize(zone) {
    Object.keys(zone).forEach(key => {
      if (!zone[key])
        delete zone[key];
    });
    return zone;
  }

  ngOnInit() {
  }

}
