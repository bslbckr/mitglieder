import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable()
export abstract class ComponentService {

    abstract registerContainer(vcr: ViewContainerRef): void;
    abstract containerListener(registerFunc: (vcr: ViewContainerRef) => void): void;
}
