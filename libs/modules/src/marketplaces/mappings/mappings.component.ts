import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'suite-mappings',
  templateUrl: './mappings.component.html',
  styleUrls: ['./mappings.component.scss']
})
export class MappingsComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
    console.log(this.route.snapshot.data['name']) 
  }

  ngOnInit() {
  }

}
