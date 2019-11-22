import { ReceptionsAvelonService, ReceptionAvelonModel } from '@suite/services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'suite-receptions-avelon',
  templateUrl: './receptions-avelon.component.html',
  styleUrls: ['./receptions-avelon.component.scss']
})
export class ReceptionsAvelonComponent implements OnInit {
  marca: Array<ReceptionAvelonModel.Data>
  modelo: Array<ReceptionAvelonModel.Data>
  color: Array<ReceptionAvelonModel.Data>
  talla: Array<ReceptionAvelonModel.Data>

  constructor(private reception: ReceptionsAvelonService) { }

  ngOnInit() {
    this.reception.getReceptions().subscribe(data => {
      this.marca = data.marca;
      this.modelo = data.modelo;
      this.color = data.colores;
      this.talla = data.talla;
    })
  }



}
