import { Logger } from '@nestjs/common';
import { createWebApp } from '@src/bootstrapt';
import { APP_PORT } from './config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CoreApiModule, CustomerApiModule } from './modules/api';

const logger = new Logger('bootstrap');

async function bootstrap() {
    const app = await createWebApp(AppModule);

    setupAdminSwagger(app);
    setupAppSwagger(app);

    await app.listen(APP_PORT, '0.0.0.0');

    logger.log(`application is running on: ${await app.getUrl()}`);
}

function setupAdminSwagger(app) {
    const config = new DocumentBuilder().setTitle('Messenger: Core').setVersion('0.1').addBearerAuth().build();
    const document = SwaggerModule.createDocument(app, config, {
        include: [CoreApiModule],
    });
    SwaggerModule.setup('api/core/docs', app, document);
}

function setupAppSwagger(app) {
    const config = new DocumentBuilder().setTitle('Messenger: Customer').setVersion('0.1').addBearerAuth().build();
    const document = SwaggerModule.createDocument(app, config, {
        include: [CustomerApiModule],
    });
    SwaggerModule.setup('api/customer/docs', app, document);
}

bootstrap();
