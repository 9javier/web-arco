import { Request } from './request';
import { DefectiveManagementChildModel } from './DefectiveManagementChild';

export namespace DefectiveManagementModel {
    export interface DefectiveManagementParent {
        createdAt: string;
        updatedAt: string;
        id: number;
        name: string;
        deletedChild?: boolean;
        updateChild?: boolean;
        addedChild?: boolean;
        open?: boolean;
        defectTypeChild: Array<DefectiveManagementChildModel.DefectiveManagementChild>
        includeInIncidenceTicket?: boolean;
        includeInDeliveryNote?: boolean;
    }

    export interface DefectiveManagementParentSelected {
      groupsWarehousePickingId: number,
      thresholdConsolidated?: number
    }

    export interface ResponseDefectiveManagementParent extends Request.Success{
        data: Array<DefectiveManagementParent>
    }

    export interface ResponseSingleDefectiveManagementParent extends Request.Success{
        data: DefectiveManagementParent;
    }

    export interface RequestDefectiveManagementParent {
        name: string;
    }
}
