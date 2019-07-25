class EventEmitter {
    constructor() {
        this.events = {};
        // this.rand = Math.random();
        // console.log(this.rand);
    }

    emit(eventName, data) {
        const event = this.events[eventName];
        if( event ) {
            event.forEach(fn => {
                fn.call(null, data);
            });
        }
    }

    subscribe(eventName, fn) {
        if(!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push(fn);
        return () => {
            this.events[eventName] = this.events[eventName].filter(eventFn => fn !== eventFn);
        }
    }
}


let eventEmitter= new EventEmitter();

export {eventEmitter};
