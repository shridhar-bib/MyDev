trigger BatchApexErrorTrigger on BatchApexErrorEvent (after  insert) {

    
    BatchApexErrorEventTriggerHandler.createEventLog(trigger.new);
}