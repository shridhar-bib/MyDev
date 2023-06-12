trigger OrderOfExecution on OrderOfExecution__c (Before insert, before update, after update) {
   

    system.debug('====trigger.isInsert==='+trigger.isInsert);
    if(true){//!orderOfexecutionHandler.skipTrigger){
        for(OrderOfExecution__c  ooe : trigger.new){
            system.debug('====Prior value===='+trigger.oldMap.get(ooe.id).ToolName__c+'====Current value='+ooe.ToolName__c);
            system.debug('====Prior value===='+trigger.oldMap.get(ooe.id).Name+'====Current value='+ooe.Name);
            if(ooe.ToolName__c == 'Before Flow'){
                ooe.ToolName__c = 'trigger';
            }
            if(ooe.ToolName__c == 'Process Builder2'){
                ooe.ToolName__c = 'Process Builder2trigger';
            }
        }
        // orderOfexecutionHandler.skipTrigger=true;
    }


    if(trigger.isUpdate && trigger.isAfter ){
        system.debug('====Prior value=update==='+trigger.oldMap.get(trigger.new[0].Id).ToolName__c+'====Current value='+trigger.new[0].ToolName__c);
            system.debug('====Prior value==update=='+trigger.oldMap.get(trigger.new[0].Id).Name+'====Current value='+trigger.new[0].Name);
            if(!orderOfexecutionHandler.skipTrigger){
        OrderOfExecution__c ofe= [Select ToolName__c from OrderOfExecution__c where id =: trigger.new[0].Id];
        ofe.ToolName__c  = 'after update';
        orderOfexecutionHandler.skipTrigger=true;
        update ofe;
            }

    }

    

}