public with sharing class BatchApexErrorEventTriggerHandler {
    public BatchApexErrorEventTriggerHandler() {

    }

    public static void createEventLog(List<BatchApexErrorEvent> errorList){
        List<BatchLeadConvertErrors__c> blcList = new List<BatchLeadConvertErrors__c>();

    for(BatchApexErrorEvent bae : errorList){
        BatchLeadConvertErrors__c blc = new BatchLeadConvertErrors__c();
        blc.AsyncApexJobId__c = bae.AsyncApexJobId;
        blc.Records__c = bae.JobScope;
        blc.StackTrace__c = bae.StackTrace;
        blc.DoesExceedJobScopeMaxLength__c = bae.DoesExceedJobScopeMaxLength;
        blc.ExceptionType__c = bae.ExceptionType;
        blc.Message__c = bae.Message;
        blc.Phase__c = bae.Phase;
        blc.ReplayId__c = bae.ReplayId;
        blc.RequestId__c = bae.RequestId;
        blcList.add(blc);
    }
    insert blcList;
    }
}