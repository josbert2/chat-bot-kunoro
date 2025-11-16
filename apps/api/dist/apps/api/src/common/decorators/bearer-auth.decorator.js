"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BearerAuth = void 0;
const common_1 = require("@nestjs/common");
exports.BearerAuth = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
        throw new Error('BearerAuth decorator used without BearerAuthGuard');
    }
    return request.user;
});
//# sourceMappingURL=bearer-auth.decorator.js.map