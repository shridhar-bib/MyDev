import { LightningElement, track, api } from "lwc";


export default class firstComp  extends LightningElement{

    @track  itsTrue = true;
    @api firstAttribute = "from js";
}