
export namespace IncidentsModel {
    export interface IncidentsModelBody {
        barcode: string;
        registeredDate: string;
        defectType: number;
        observations: string;
        gestionState: number;
        photo: string;
        validation: boolean;
    }
}