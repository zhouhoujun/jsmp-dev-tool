/// <reference types="gulp" />
import { Gulp } from 'gulp';
import { ITaskOption } from './TaskOption';
import { IContext } from './IContext';
import { Context } from './Context';
import { Src, ITaskConfig, IAssertOption, IDynamicTaskOption, RunWay } from 'development-core';
export interface IDevelopment extends IContext {
    /**
     * start.
     *
     * @returns {Src}
     * @memberof IDevelopment
     */
    start(): Src;
}
/**
 * Development.
 *
 * @export
 * @class Development
 * @extends {Context}
 */
export declare class Development extends Context implements IDevelopment {
    private root;
    /**
     * create development tool.
     *
     * @static
     * @param {Gulp} gulp
     * @param {string} root  root path.
     * @param {(ITaskConfig | Array<IAssertOption | ITaskOption | IDynamicTaskOption>)} setting
     * @param {any} [runWay=RunWay.sequence]
     * @returns {Development}
     *
     * @memberOf Development
     */
    static create(gulp: Gulp, root: string, setting: ITaskConfig | Array<IAssertOption | ITaskOption | IDynamicTaskOption>, name?: string, runWay?: RunWay): Development;
    /**
     * Creates an instance of Development.
     * @param {ITaskConfig} config
     * @param {string} root root path.
     * @param {IContext} [parent]
     * @memberof Development
     */
    constructor(config: ITaskConfig, root?: string);
    getRootPath(): string;
    /**
     * get all tasks sequence
     */
    allTasks(): void[];
    /**
     * start task.
     *
     * @returns {Src}
     * @memberof Development
     */
    start(): Src;
    protected printHelp(help: string): void;
}
