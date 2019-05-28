import { Request } from './request';
import { UserModel } from './User';
export namespace TypeUsersProcesses{
    /**intern use no needed to export */
    interface Process{
        id:number;
        processType:number;
    }
    export interface UsersProcesses{
        id:number;
        name:string;
        email:string;
        processes:Array<Process>;
        performance:number;
    }

    export interface UsersProcessesToSend{
        id:number;
        processes:Array<number>;
        performance:number;
    }

    /**success response for get index request */
    export interface ResponseIndex extends Request.Success{
        data:Array<UsersProcesses>;
    }

    /**success response for unassign post request */
    export interface ResponseUnassign extends Request.Success{
        data:Array<{
            userId:number;
            rowsDeleted:number;
        }>;
    }
    
    /**success response for assign request */
    export interface ResponseAssign extends Request.Success{
        data:Array<{
            user:UserModel.User,
            processType: number,
            createdAt: string,
            updatedAt: string,
            id: number
        }>
    }

}