import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

export default class ChildComp2 extends LightningElement {
    @track input;
    @wire(CurrentPageReference) pageRef;
    
    onchangeinput(event){
        this.input = event.target.value;
    }
    onFiresPubSubEvet(event){
        fireEvent(this.pageRef, 'pubsubevent', this.input);
    }
}