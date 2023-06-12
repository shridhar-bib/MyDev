trigger afterUpdateSytemValCHeck on OrderOfExecution__c (before update, after update) {
   

    if(trigger.isUpdate && trigger.isBefore ){
        //if(!orderOfexecutionHandler.skipTrigger){
            
            // if(trigger.old[0].ToolName__c == 'Ran by bf Trigger2'){
            //     trigger.new[0].ToolName__c = 'Test';
            // }

            if(trigger.new[0].ToolName__c == 'Ran by Trigger2'){
                trigger.new[0].ToolName__c = 'Ran by bf Trigger2';
            }

            
         //}
            

    }
    
    if(trigger.isUpdate && trigger.isAfter ){
        //if(!orderOfexecutionHandler.skipTrigger){
            OrderOfExecution__c ofe= [Select ToolName__c from OrderOfExecution__c where id =: trigger.new[0].Id];
            
            // if(ofe.ToolName__c == 'Ran By Work flow'){
            //     // ofe.ToolName__c  = 'RunWF'; 
            //     ofe.ToolName__c  = 'Ran by Trigger'; 
            //     orderOfexecutionHandler.skipTrigger=true;       
            //     update ofe;
            // }
            if(ofe.ToolName__c == 'Ran by workflow2'){
                // ofe.ToolName__c  = 'RunWF'; 
                ofe.ToolName__c  = 'Ran by Trigger2'; 
                orderOfexecutionHandler.skipTrigger=true;       
                update ofe;
            }
            if(ofe.ToolName__c == 'Ran by bf Trigger2'){
                // ofe.ToolName__c  = 'RunWF'; 
                ofe.ToolName__c  = 'Ran by Trigger3'; 
                orderOfexecutionHandler.skipTrigger=true;       
                update ofe;
            }

         //}
            

    }

    

}