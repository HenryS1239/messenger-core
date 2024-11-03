import { Module } from '@nestjs/common';

import { ProcessModule } from '@src/modules/worker/process';

@Module({
    imports: [ProcessModule],
})
export class WorkerModule {}
