import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'suite-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  constructor(private route: ActivatedRoute) { 
    console.log(this.route.snapshot.data['name'])
  }

  ngOnInit() {
  }

}
