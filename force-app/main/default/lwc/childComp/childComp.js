import { LightningElement, track, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class ChildComp extends LightningElement {
    greeting = 'World';
    @track accountRecRes;
    @api recordId = '0010o000032ev4MAAQ';
    @api messagefromparent;

    // 123========================event=====================================================
    changeHandler(event) {
        const eve = new CustomEvent('myfirstevent', { detail: { value: this.messagefromparent } });
        this.dispatchEvent(eve);
    }

    chagetoparent(event){
        this.messagefromparent = event.target.value;
        this.changeHandler(event);
    }

    @api childmethod(event){
        console.log(event);
        alert('i am child method');
    }

    // ========================lifecycle hooks========================================
    constructor() {
        super();
        //alert('child constructore');
        console.log('child constructor');
    }

    connectedCallback() {
        //alert('child connectedCallback');
        console.log('child connectedCallback');

    }

    renderedCallback() {
        //alert('child renderedCallback');
        console.log('child renderedCallback');
    }

    @wire(getRecord, { recordId: '$recordId', fields: ['Account.Name'] })
    accountRec({ error, data }) {
        if (data) {
            this.accountRecRes = data;
            // this.greeting = this.accountRecRes.fields.Name.value;
            //alert('child wire method');
        } else if (error) {
            // this.greeting = '';
        }
    }
}