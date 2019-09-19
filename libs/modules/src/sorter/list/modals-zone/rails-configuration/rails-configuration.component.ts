import { Component, OnInit } from '@angular/core';
import { IntermediaryService } from '@suite/services';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'suite-rails-configuration',
  templateUrl: './rails-configuration.component.html',
  styleUrls: ['./rails-configuration.component.scss']
})
export class RailsConfigurationComponent implements OnInit {

  rails = [
    {
      height:1,
      columns:[
        {column:1, ways_number:1},
        {column:2, ways_number:2},
        {column:3, ways_number:3}
      ]
    },
    {
      height:2,
      columns:[
        {column:1, ways_number:4},
        {column:2, ways_number:5},
        {column:3, ways_number:6}
      ]
    },
    {
      height:3,
      columns:[
        {column:1, ways_number:7},
        {column:2, ways_number:8},
        {column:3, ways_number:9}
      ]
    }
  ]

  constructor(
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
  ) { }

  ngOnInit() {}

  
  close():void{
    this.modalController.dismiss();
  }

  submit():void{
    console.log('submit')
  }

  getColumn(index: number, column: number, height: number): void {
    //get right and left values
    this.rails.forEach(rail => {
      if(rail.height == height) {
       let columns = rail.columns;
       for(let i = 0; i < columns.length; i++) 
        if(column == columns[i].ways_number) {
          console.log('Current: '+column)
          if(columns[i-1]) {
            console.log('Left: '+columns[i-1].ways_number)
          }
          if(columns[i+1]) {
            console.log('Right: '+columns[i+1].ways_number)
          }
        }
      }
    })

    //get top and bottom
    for(let i = 0; i < this.rails.length; i++) {
      if(this.rails[i].height == height) {
          if(this.rails[i-1]) {
            for(let j = 0; j < this.rails[i-1].columns.length; j++) {
              if(j == index){
                console.log('Top: '+ this.rails[i-1].columns[j].ways_number)
              }
            }
          }
          if(this.rails[i+1]) {
            for(let j = 0; j < this.rails[i+1].columns.length; j++) {
              if(j == index){
                console.log('Bottom: '+ this.rails[i+1].columns[j].ways_number)
              }
            }
          }
      }
    }
  }

}
