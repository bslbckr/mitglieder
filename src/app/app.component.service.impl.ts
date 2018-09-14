import { ComponentService } from './app.component.service';
import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable()
export class ComponentServiceImpl extends ComponentService {

    private listeners: ((vcr: ViewContainerRef) => void)[];

    constructor() {
        super();
        this.listeners = [];
    }

    registerContainer(ref: ViewContainerRef) {
        this.listeners.forEach(l => l(ref));
    }

    containerListener(fn: (vcr: ViewContainerRef) => void) {
        this.listeners.push(fn);
    }
}

