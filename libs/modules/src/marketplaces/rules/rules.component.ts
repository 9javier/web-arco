import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'suite-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  constructor(private route: ActivatedRoute) { 
    console.log(this.route.snapshot.data['name'])
  }

  ngOnInit() {
  }

}
