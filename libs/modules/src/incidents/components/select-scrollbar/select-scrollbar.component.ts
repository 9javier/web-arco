import { Component, Input, Output, EventEmitter, OnInit, ViewContainerRef, TemplateRef, NgZone, Popper } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';
import { AlertController } from "@ionic/angular";
import { PrinterService } from "../../../../../services/src/lib/printer/printer.service";
import {ItemReferencesProvider} from "../../../../../services/src/providers/item-references/item-references.provider";
import { IntermediaryService, PriceModel, PriceService } from '@suite/services';
import { PrintModel } from "../../../../../services/src/models/endpoints/Print";
import { environment as al_environment } from "../../../../../../apps/al/src/environments/environment";
import { AudioProvider } from "../../../../../services/src/providers/audio-provider/audio-provider.provider";
import { KeyboardService } from "../../../../../services/src/lib/keyboard/keyboard.service";
import { PositionsToast } from '../../../../../services/src/models/positionsToast.type';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'suite-select-scrollbar',
  templateUrl: './select-scrollbar.component.html',
  styleUrls: ['./select-scrollbar.component.scss']
})
export class SelectScrollbarComponent implements OnInit{
  @Input() labelKey = 'label';
  @Input() idKey = 'id';
  @Input() options = [];
  @Input() model;
  @Output() selectChange = new EventEmitter();
  searchControl = new FormControl();
  visibleOptions = 4;
  originalOptions: any[];
  view: any;
  popperRef: any;
  closed: any;

  constructor(private vcr: ViewContainerRef, private zone: NgZone) {}

  ngOnInit() {
    this.originalOptions = [...this.options];
    if (this.model !== undefined) {
      this.model = this.options.find(
        currentOption => currentOption[this.idKey] === this.model
      );
    }
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        untilDestroyed(this)
      )
      .subscribe(term => this.search(term));
  }

  open(dropdownTpl: TemplateRef<any>, origin: HTMLElement) {
    this.view = this.vcr.createEmbeddedView(dropdownTpl);
    const dropdown = this.view.rootNodes[0];

    document.body.appendChild(dropdown);
    dropdown.style.width = `${origin.offsetWidth}px`;

    this.zone.runOutsideAngular(() => {
      this.popperRef = new Popper(origin, dropdown, {
        removeOnDestroy: true
      });
    });
  }

  search(value: string) {
    this.options = this.originalOptions.filter(
      option => option[this.labelKey].includes(value)
    );
    requestAnimationFrame(() => (this.visibleOptions = this.options.length || 1));
  }

  select(option) {
    this.model = option;
    this.selectChange.emit(option[this.idKey]);
  }

  isActive(option) {
    if (!this.model) {
      return false;
    }

    return option[this.idKey] === this.model[this.idKey];
  }

  close() {
    this.closed.emit();
    this.popperRef.destroy();
    this.view.destroy();
    this.searchControl.patchValue('');
    this.view = null;
    this.popperRef = null;
  }

  get label() {
    return this.model ? this.model[this.labelKey] : 'Select...';
  }

}
