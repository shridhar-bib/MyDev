import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterListener, unregisterAllListeners  } from 'c/pubsub';

export default class ChildComp1 extends LightningElement {
    @wire(CurrentPageReference) pageRef;

    connectedCallback(){
        registerListener('pubsubevent', this.pubsubEventHandler, this);
    }

    pubsubEventHandler(value){
        alert(value);
    }

    disconnectedCallback(){
        unregisterAllListeners(this);
    }
}