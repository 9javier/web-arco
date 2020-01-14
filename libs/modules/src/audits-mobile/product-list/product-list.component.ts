import { Component, OnInit } from '@angular/core';
import { AuditsService, IntermediaryService } from '@suite/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'suite-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  public Products : any = [{name:'yui'}];
  public add : any ;
  public jaula : any ;
  public id : any ;
  public back : any ;

  constructor(
    private audit : AuditsService,
    private intermediaryService : IntermediaryService,
    private activeRoute: ActivatedRoute
  ) {
    this.add = this.activeRoute.snapshot.params.add;
    this.jaula = this.activeRoute.snapshot.params.jaula;
    this.id = this.activeRoute.snapshot.params.id;
    this.back = this.activeRoute.snapshot.url[0].path;
  }

  ngOnInit() {
    this.listProducts();
  }

  listProducts(){
    this.audit.getProducts({packingReference:this.jaula}).subscribe(res =>{
      this.Products = res.data;
    },err =>{
      this.intermediaryService.presentToastError(err.error.result.reason);
    })
  }

}
