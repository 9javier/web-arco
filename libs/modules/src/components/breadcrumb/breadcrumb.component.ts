import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router,Route } from '@angular/router';


@Component({
  selector: 'suite-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @Input() patch;
  @Input() post;
  public breadCrumbs:Array<Route> = [];

  @Input() set override(override){
    if(override){
      this.breadCrumbs = override.map(override=>{
        return {path:override.url,data:{name:override.name}}
      })
    }
  }
  private listOfRoutes:Array<Route> = this.router.config;

  constructor(private activatedRoute:ActivatedRoute, private router:Router) { }

  ngOnInit() {
    if(!this.breadCrumbs.length)
      this.getBreadcrumbs();
  }

  /**
   * Obtain the breadcrumb names for this route
   */
  getBreadcrumbs():void{
    
    let activePath = this.router.url.substr(1);

    while(activePath){
      let levelRoute = this.getRouteByPath(activePath);
      let activePathArray = activePath.split("/");
      activePath = activePathArray.slice(0,activePathArray.length-1).join("/");
      if(levelRoute) {
        this.breadCrumbs.push(levelRoute);
      }
    }
    if(this.patch) {
      this.breadCrumbs[0] = {
        path: '',
        data:{
          name:this.patch
        }
      };
    } else {
      this.breadCrumbs[0].path = '';
    }
    this.breadCrumbs = this.breadCrumbs.reverse();
    if(this.post && !this.patch) {
      this.breadCrumbs.push(
        {
          path: '',
          data:{
            name:this.post
          }
        }
      );
    }
  }

  /**
   * get route by path
   */
  getRouteByPath(path:string):Route{
    let route;
    this.listOfRoutes.forEach(_route=>{
      if(_route.path == path)
        route = Object.assign({},(_route));
    });
    return route;
  }

}
