import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PickingProvider} from "../../../services/src/providers/picking/picking.provider";
import {AuthenticationService} from "@suite/services";
import {Router  } from '@angular/router';
import { ToolbarProvider } from "../../../services/src/providers/toolbar/toolbar.provider";
import {ListPickingTasksTemplateComponent} from "./list/list.component";


@Component({
  selector: 'suite-picking-tasks',
  templateUrl: './picking-tasks.component.html',
  styleUrls: ['./picking-tasks.component.scss']
})
export class PickingTasksComponent implements OnInit {

  public isStoreChecked: boolean = false;
  public isStore: boolean = false;
  @ViewChild(ListPickingTasksTemplateComponent) childPickingTask:ListPickingTasksTemplateComponent;

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private pickingProvider: PickingProvider,
    private router: Router,
    private toolbarProvider: ToolbarProvider
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe((params: any )=> {
      let paramsReceived = params.params;
      if (typeof paramsReceived.method === 'string' && paramsReceived.method === 'manual') {
        this.pickingProvider.method = 'manual';
      } else {
        this.pickingProvider.method = 'scanner';
      }
    });

    this.isStore = await this.authenticationService.isStoreUser();
    this.isStoreChecked = true;
  }

  async ionViewWillEnter() {
    if(!this.isStore){
      this.childPickingTask.userId = await this.authenticationService.getCurrentUserId();
      await this.childPickingTask.loadPickings();
    }
  }

  isHomeRoute() {
    return this.router.url === '/picking-tasks/manual';
  }

  returnMenuPikingTask(){
    this.router.navigate(['/picking-tasks']);
    this.toolbarProvider.currentPage.next("Tareas de Picking");
  }
}
