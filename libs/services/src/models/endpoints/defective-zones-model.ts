import { Request } from './request';
import { DefectiveZonesChildModel } from './DefectiveZonesChild';

export namespace DefectiveZonesModel {
    export interface DefectiveZonesParent {
        createdAt: string;
        updatedAt: string;
        id: number;
        name: string;
        deletedChild?: boolean;
        updateChild?: boolean;
        addedChild?: boolean;
        open?: boolean;
        defectZoneChild: Array<DefectiveZonesChildModel.DefectiveZonesChild>
    }

    export interface DefectiveZonesParentSelected {
      groupsWarehousePickingId: number,
      thresholdConsolidated?: number
    }

    export interface ResponseDefectiveZonesParent extends Request.Success{
        data: Array<DefectiveZonesParent>
    }

    export interface ResponseSingleDefectiveZonesParent extends Request.Success{
        data: DefectiveZonesParent;
    }

    export interface RequestDefectiveZonesParent {
        name: string;
    }
}
