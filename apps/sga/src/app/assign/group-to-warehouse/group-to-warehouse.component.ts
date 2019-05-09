import { Component, OnInit } from '@angular/core';
import {
  GroupsService,
  GroupModel,
  WarehouseModel,
} from '@suite/services';
import { Observable } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { MatSelectionListChange, MatListOption } from '@angular/material/list';
import { mergeMap } from 'rxjs/operators';


@Component({
  selector: 'suite-permission-to-rol',
  templateUrl: './group-to-warehouse.component.html',
  styleUrls: ['./group-to-warehouse.component.scss']
})
export class GroupToWarehouseComponent implements OnInit {
  groups: GroupModel.Group[] = [];
  warehouses: WarehouseModel.Warehouse[] =[];
  constructor(
    private groupsService: GroupsService,
  ) {}

  ngOnInit() {
    Promise.all([
      this.groupsService.getIndex(),
    ]).then(
      (data: any) => {
        data[0].subscribe(
          (res: HttpResponse<GroupModel.ResponseIndex>) => {
            this.groups = res.body.data;
            console.log(this.groups);
          }
        );
      },
      err => {
        console.log(err);
      }
    );
  }
}
