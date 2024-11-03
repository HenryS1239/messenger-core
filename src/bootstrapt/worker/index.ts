import { Logger } from "@nestjs/common";
import { AppWorkerModule } from "./app-worker.module";
import { createApp } from "../index";

const logger = new Logger("worker-bootstrap");

async function bootstrap() {
    const app = await createApp(AppWorkerModule);
    await app.init();
    logger.verbose(`application is running`);
}

bootstrap();
