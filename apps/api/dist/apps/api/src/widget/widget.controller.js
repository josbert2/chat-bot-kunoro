"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetController = void 0;
const common_1 = require("@nestjs/common");
const widget_service_1 = require("./widget.service");
const widget_dto_1 = require("./dto/widget.dto");
let WidgetController = class WidgetController {
    constructor(widgetService) {
        this.widgetService = widgetService;
    }
    async init(siteKey, body) {
        return this.widgetService.init(siteKey, body);
    }
    async sendMessage(siteKey, body) {
        return this.widgetService.sendMessage(siteKey, body);
    }
    async offlineForm(body) {
        return this.widgetService.handleOfflineForm(body);
    }
};
exports.WidgetController = WidgetController;
__decorate([
    (0, common_1.Post)('init'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Headers)('x-site-key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof widget_dto_1.WidgetInitDto !== "undefined" && widget_dto_1.WidgetInitDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], WidgetController.prototype, "init", null);
__decorate([
    (0, common_1.Post)('messages'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Headers)('x-site-key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WidgetController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)('offline'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WidgetController.prototype, "offlineForm", null);
exports.WidgetController = WidgetController = __decorate([
    (0, common_1.Controller)('widget'),
    __metadata("design:paramtypes", [typeof (_a = typeof widget_service_1.WidgetService !== "undefined" && widget_service_1.WidgetService) === "function" ? _a : Object])
], WidgetController);
//# sourceMappingURL=widget.controller.js.map