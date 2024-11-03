import { MongooseModule as MongooseModuleCore } from '@nestjs/mongoose';
import { MONGO_URI } from '@src/config';

export const MongooseModule = MongooseModuleCore.forRoot(MONGO_URI, {
    autoIndex: false,
});
export { DatabaseModule } from './database.module';
export { DatabaseService } from './database.service';

export * as DatabaseSchema from './schema';
