import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'suite-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  @Input() set template(template) {
    if (template)
      this.form.patchValue(template);
  }

  form: FormGroup = this.formBuilder.group({
    id: [''],
    name: ['', Validators.required],
    equalParts: [null]
  });

  constructor(
    private formBuilder: FormBuilder
  ) { }


  getValue() {
    return this.sanitize(this.form.value);
  }

  sanitize(template) {
    Object.keys(template).forEach(key => {
      if (!template[key])
        delete template[key];
    });
    return template;
  }

  ngOnInit() {
  }

}
