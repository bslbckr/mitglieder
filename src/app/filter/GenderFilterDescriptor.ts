import { AbstractFilterDescriptor } from './AbstractFilterDescriptor';
import { GenderFilterComponent } from './GenderFilter';
import { Injectable, Type } from '@angular/core';

@Injectable()
export class GenderFilterDescriptor extends AbstractFilterDescriptor<GenderFilterComponent> {

    public get ComponentType(): Type<GenderFilterComponent> {
        return GenderFilterComponent;
    }
}
