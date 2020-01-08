import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'suite-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  categories_data = [
    {
      name: 'Mujer', 
      categories: 'Mujer, mujer outlet, mujer rebajas, todo mujer', 
      product_quantity: '3655 productos'}
  ];

  displayedCategoriesColumns: string[] = ['name', 'categories', 'product_quantity'];
  dataSourceCategories = this.categories_data;

  constructor(private route: ActivatedRoute) { 
    console.log(this.route.snapshot.data['name'])
  }

  ngOnInit() {
  }

}
