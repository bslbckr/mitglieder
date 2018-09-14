import { Directive, ViewContainerRef } from '@angular/core';
import { ComponentService } from './app.component.service';

@Directive({
    selector: '[appViewrefContainer]'
})
export class ViewRefDirective {

    constructor(vc: ViewContainerRef, service: ComponentService) {
        service.registerContainer(vc);
    }
}

