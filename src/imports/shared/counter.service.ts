import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';

@Injectable()
export class CounterService {
    constructor(private readonly database: DatabaseService) {}

    public async newCounter(id, start = 1000000) {
        let counterObj = await this.database.Counter.findOne({ id });

        if (!counterObj) {
            counterObj = new this.database.Counter();
            counterObj.id = id;
            counterObj.seq = start;
            await counterObj.save();
        }
        counterObj.seq += 1;
        await counterObj.save();
        return counterObj.seq;
    }
}
