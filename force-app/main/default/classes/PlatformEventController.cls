public class PlatformEventController {
    
    @auraEnabled
    public static string publishPlatformEvent(){
          /*  Database.SaveResult result;
        Order_Event__e order = new Order_Event__e();
        order.Order_Number__c = 'sadfdsf';
        order.Has_Shipped__c = true;
        order.UserId__c = Userinfo.getUserId();
        result = EventBus.publish(order);
        
        if(result != null && result.isSuccess() != null && result.isSuccess()) {
            return 'succeesss';
        }else{
            string ss='faill';
            if(result != null && result.getErrors() != null) {//not using exact error not, but for future it can be used to dispaky extact errro
                system.debug('--error'+result);
                for(Database.Error err : result.getErrors()) {
                    System.debug('Error returned: ' +err.getStatusCode() +' - ' +err.getMessage());
                    ss+= String.valueOf(err.getMessage());
                }
            }
            return ss;*/
            return null;
        }
        
    
  
}