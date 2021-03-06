import { ITaskDefine } from 'development-core';
import { BaseLoader } from './BaseLoader';
import { IContext } from '../IContext';
export declare class DynamicLoader extends BaseLoader {
    constructor(ctx: IContext);
    protected loadTaskDefine(): ITaskDefine | Promise<ITaskDefine>;
}
