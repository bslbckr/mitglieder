import { Injectable } from '@angular/core';
import { AbstractFilterDescriptor } from './AbstractFilterDescriptor';
import { TextFilterComponent } from './TextFilterComponent';

@Injectable()
export class TextFilterDescriptor extends AbstractFilterDescriptor<TextFilterComponent> {

    get ComponentType() {
        return TextFilterComponent;
    }
}
