"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-site-key'],
    });
    app.setGlobalPrefix('v1');
    const port = process.env.API_PORT || 3001;
    await app.listen(port);
    console.log(`🚀 API running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map