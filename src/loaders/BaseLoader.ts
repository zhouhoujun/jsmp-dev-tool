import * as _ from 'lodash';
import { Src, Task, EnvOption, Operation, TaskOption, TaskConfig, ITaskDefine } from '../TaskConfig';
import { ITaskLoader } from '../ITaskLoader';
const requireDir = require('require-dir');
import * as chalk from 'chalk';
// import { isAbsolute } from 'path';

export abstract class BaseLoader implements ITaskLoader {

    protected option: TaskOption;
    constructor(option: TaskOption) {
        this.option = option;
    }

    load(cfg: TaskConfig): Promise<Task[]> {
        return this.getTaskDefine()
            .then(def => {
                if (def.moduleTaskLoader) {
                    return def.moduleTaskLoader(cfg);
                } else {
                    let mdl = this.getTaskModule();
                    return this.loadTaskFromModule(mdl);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    loadConfg(oper: Operation, env: EnvOption): Promise<TaskConfig> {

        return this.getTaskDefine()
            .then(def => {
                return def.moduleTaskConfig(oper, this.option, env);
            })
            .then(config => {
                return this.bindingConfig(config);
            })
            .catch(err => {
                console.error(err);
            });
    }

    protected bindingConfig(cfg: TaskConfig): TaskConfig {
        cfg.findTasksInDir = cfg.findTasksInDir || ((dirs) => {
            return this.loadTaskFromDir(dirs);
        });
        cfg.findTasksInModule = cfg.findTasksInModule || ((mdl) => {
            return this.loadTaskFromModule(mdl);
        });
        return cfg;
    }

    protected getTaskDefine(): Promise<ITaskDefine> {
        let tsdef: ITaskDefine = null;
        if (!_.isString(this.option.loader)) {
            if (this.option.loader.taskDefine) {
                tsdef = this.option.loader.taskDefine;
            }
        }
        if (!tsdef) {
            let mdl = this.getConfigModule();
            tsdef = this.findTaskDefine(mdl);
        }
        if (tsdef) {
            return Promise.resolve(tsdef);
        } else {
            // console.error('can not found task config builder method in module {0}.', mdl);
            return Promise.reject('can not found task define.');
        }
    }

    protected getConfigModule(): any {
        let ml: string;
        if (_.isString(this.option.loader)) {
            ml = this.option.loader
        } else {
            ml = this.option.loader.configModule || this.option.loader.module;
        }

        if (_.isString(ml)) {
            return require(ml);
        } else {
            return ml;
        }
    }

    protected getTaskModule(): any {
        let ml: string;
        if (_.isString(this.option.loader)) {
            ml = this.option.loader
        } else {
            ml = this.option.loader.taskModule || this.option.loader.module;
        }

        if (_.isString(ml)) {
            return require(ml);
        } else {
            return ml;
        }
    }

    protected findTaskDefine(mdl: any): ITaskDefine {
        let def: ITaskDefine = null;
        if (this.isTaskDefine(mdl)) {
            def = mdl;
        }

        if (!def && mdl) {
            _.each(_.keys(mdl), f => {
                if (def) {
                    return false;
                }
                if (this.isTaskDefine(mdl[f])) {
                    def = mdl[f];
                }
                return true;
            });
        }

        return def;

    }

    private isTaskDefine(mdl: any): boolean {
        if (!mdl) {
            return false;
        }
        if (!_.isString(this.option.loader) && this.option.loader.isTaskDefine) {
            return this.option.loader.isTaskDefine(mdl);
        }
        return _.isFunction(mdl['moduleTaskConfig']);
    }

    protected isTaskFunc(mdl: any, exceptObj = false): boolean {
        if (!mdl) {
            return false;
        }

        if (!_.isString(this.option.loader) && this.option.loader.isTaskFunc) {
            return this.option.loader.isTaskFunc(mdl);
        }

        if (_.isFunction(mdl)) {
            return true;
        }

        return exceptObj;
    }

    private findTasks(mdl: any): Task[] {
        let tasks = [];
        if (!mdl) {
            return tasks;
        }
        if (this.isTaskFunc(mdl)) {
            tasks.push(mdl);
        } else if (!this.isTaskDefine(mdl)) {
            if (_.isArray(mdl)) {
                _.each(mdl, sm => {
                    tasks.concat(this.findTasks(sm));
                });
            } else {
                _.each(_.keys(mdl), key => {
                    console.log(chalk.grey('register task from:'), chalk.cyan(key));
                    tasks = tasks.concat(this.findTasks(mdl[key]));
                });
            }
        }
        return tasks;
    }

    protected loadTaskFromModule(mdl: any): Promise<Task[]> {
        let taskfuns: Task[] = this.findTasks(mdl);
        if (!taskfuns || taskfuns.length < 1) {
            console.log(chalk.red('error module:'), mdl);
            return Promise.reject('has not found task in module.');
        } else {
            return Promise.resolve(taskfuns);
        }
    }

    protected loadTaskFromDir(dirs: Src): Promise<Task[]> {
        return Promise.all(_.map(_.isArray(dirs) ? <string[]>dirs : [<string>dirs], dir => {
            console.log(chalk.grey('begin load task from dir'), chalk.cyan(dir));
            let mdl = requireDir(dir, { recurse: true });
            return this.loadTaskFromModule(mdl);
        }))
            .then(tasks => {
                return _.flatten(tasks);
            });
    }
}
