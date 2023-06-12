trigger shareObjCheck on Small_tower__c (after insert) {

checkShareObjContr.shareReco(trigger.new);

}