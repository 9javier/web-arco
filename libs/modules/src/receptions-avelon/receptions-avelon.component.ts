import { ReceptionsAvelonService, ReceptionAvelonModel } from '@suite/services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'suite-receptions-avelon',
  templateUrl: './receptions-avelon.component.html',
  styleUrls: ['./receptions-avelon.component.scss']
})
export class ReceptionsAvelonComponent implements OnInit {
  response: ReceptionAvelonModel.Reception;
  constructor(private reception: ReceptionsAvelonService) { }

  ngOnInit() {
    this.response = {
      brands: [],
      models: [],
      sizes:  [],
      colors: [],
      ean:    ''
    }
    this.reception.getReceptions().subscribe((data: ReceptionAvelonModel.Reception)  => {
      console.log(data);
      this.response = data;
    })
  }



}
