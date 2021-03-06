"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var taskDefine_1 = require("../utils/taskDefine");
var BaseLoader_1 = require("./BaseLoader");
var DynamicLoader = (function (_super) {
    __extends(DynamicLoader, _super);
    function DynamicLoader(ctx) {
        var _this = _super.call(this, ctx) || this;
        _this.name = 'dynamic';
        return _this;
    }
    DynamicLoader.prototype.loadTaskDefine = function () {
        return taskDefine_1.default(this.getTaskModule());
    };
    return DynamicLoader;
}(BaseLoader_1.BaseLoader));
exports.DynamicLoader = DynamicLoader;

//# sourceMappingURL=../sourcemaps/loaders/DynamicLoader.js.map
