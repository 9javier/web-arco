import {Component, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {ReceptionAvelonModel} from "@suite/services";
import Expedition = ReceptionAvelonModel.Expedition;
import {
  ModelService
} from '@suite/services';

@Component({
  selector: 'suite-json-modal',
  templateUrl: './json-modal.component.html',
  styleUrls: ['./json-modal.component.scss']
})
export class JsonModalComponent implements OnInit {

  title: string = 'Previsualización de JSON en modelo';
  model = null;
  copy_text = "Copiar JSON";
  
  constructor(
    private modalController: ModalController,
    private modelService: ModelService,
  ){}

  async ngOnInit() {

    this.title = 'Previsualización de JSON en modelo ' + this.model.reference;

    // this.model.json = JSON.stringify(this.model.json

  }
  async close() {
    await this.modalController.dismiss();
  }

  copyToClipboard(item) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this.copy_text = "¡Copiado!";
  }

}
