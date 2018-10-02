import { Injectable, Type } from '@angular/core';
import { StateFilterComponent } from './StateFilterComponent';
import { AbstractFilterDescriptor } from './AbstractFilterDescriptor';

@Injectable()
export class StateFilterDescriptor extends AbstractFilterDescriptor<StateFilterComponent> {

    public get ComponentType(): Type<StateFilterComponent> {
        return StateFilterComponent;
    }
}
