import { LightningElement, track, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import childcomp from './childcomp1.html';
import helloWorld from './helloWorld.html';

export default class HelloWorld extends LightningElement {
     greeting = 'World';
    @track accountRecRes;
    @api recordId = '0010o000032ev4MAAQ';
    messagetochild = 'I am from parent';



    // ==============================event==============================================
    onChangemessagetochild(event) {
        this.messagetochild = event.target.value;
    }
    handleChildEvent(event) {
        // alert(event.detail);
        this.messagetochild = event.detail.value;
    }

    callChild(event) {
        // alert(this.template.querySelector("c-child-comp"));
        this.template.querySelector("c-child-comp").childmethod(event);
    }


    // ==============================begin==============================================
    changeHandler(event) {
        this.greeting = event.target.value;
        // this.recordId = '0010o00002wS9BpAAK';
    }

    @wire(getRecord, { recordId: '$recordId', fields: ['Account.Name'] })
    accountRec({ error, data }) {
        if (data) {
            this.accountRecRes = data;
            // this.greeting = this.accountRecRes.fields.Name.value;
            //alert('parent wire method');
        } else if (error) {
            // this.greeting = '';
        }
    }

     

    // ========================lifecycle hooks============================================
    constructor() {
        super();
        //alert('parent constructore');
        console.log('parent constructor');
    }

    connectedCallback() {
        //alert('parent connectedCallback');
        console.log('parent connectedCallback');
    }

    renderedCallback() {
        //alert('parent renderedCallback');
        console.log('parent renderedCallback');
    }

    render(){
        //alert('parent render');
        if (this.greeting == 'World' ){
            return helloWorld;
        }else{
            return childcomp1;
        }
    }


   
}