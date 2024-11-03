import { Subject } from 'rxjs';

export abstract class BaseBus {

    private readonly subject = new Subject();

    private readonly subscribers = [];

    protected constructor(public readonly name: string) {
    }

    public subscribe(observer) {
        this.subscribers.push(this.subject.subscribe(observer));
    }

    public dispatch(event) {
        this.subject.next(event);
    }

    public flush() {
        this.subscribers.forEach(observer => {
            observer.unsubscribe();
        });
        this.subscribers.length = 0;
    }
}
