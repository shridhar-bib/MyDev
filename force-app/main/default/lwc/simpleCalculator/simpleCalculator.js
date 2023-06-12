import { LightningElement, track } from 'lwc';

export default class SimpleCalculator extends LightningElement {
    @track currentResult;

    firstNumber;
    secondNumber;

    numberChandeHandler(event){
        const tagName = event.target.name;
        if (tagName === 'First Number'){
            this.firstNumber  =parseInt(event.target.value);
        } else if (tagName === 'Second Number') {
            this.secondNumber = parseInt(event.target.value);
        }
    }

    addNumbers(){
        this.currentResult = this.firstNumber * this.secondNumber;
    }
    
}