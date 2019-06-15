import { ComponentFactoryResolver, ComponentFactory, Injectable, Type } from '@angular/core';

@Injectable()
export abstract class AbstractFilterDescriptor<T> {

    constructor(private resolver: ComponentFactoryResolver) { }

    public abstract get ComponentType(): Type<T>;

    public ProvideComponentFactory(): ComponentFactory<T> {
        return this.resolver.resolveComponentFactory(this.ComponentType);
    }
}
