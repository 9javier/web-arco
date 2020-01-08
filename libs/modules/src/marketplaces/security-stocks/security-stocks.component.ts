import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'suite-security-stocks',
  templateUrl: './security-stocks.component.html',
  styleUrls: ['./security-stocks.component.scss']
})
export class SecurityStocksComponent implements OnInit {

  constructor(private route: ActivatedRoute) { 
    console.log(this.route.snapshot.data['name'])
  }

  ngOnInit() {
  }

}
