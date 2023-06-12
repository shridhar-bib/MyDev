trigger test on Opportunity (before update) {
for(opportunity o : trigger.new){
if(o.test__c > 10){
o.test__c = 10;
}
}

}