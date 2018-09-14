import { AbstractFilterDescriptor } from './AbstractFilterDescriptor';
import { TestFilterComponent } from './TestFilterComponent';
import { ComponentFactoryResolver, Injectable, Type } from '@angular/core';

@Injectable()
export class TestFilterDescriptor extends AbstractFilterDescriptor<TestFilterComponent> {

    constructor(private res: ComponentFactoryResolver) {
        super(res);
    }

    public get ComponentType(): Type<TestFilterComponent> {
        return TestFilterComponent;
    }
}
