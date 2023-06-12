public class MultiStringSearchInvocable {
    @InvocableMethod(label='Update MultiPicklist' description='')
    public static void updateReadOnlyRecordType(List<Id> accIdList) {
       List<Account> AccList = [SELECT MultiStringSOQLTest__c,SLASerialNumber__c	 FROM Account WHERE Id in : accIdList];
       
        for(Account acc : AccList){
			acc.MultiStringSOQLTest__c = acc.SLASerialNumber__c.replace(',', ';');
        }
        
        if(!AccList.isEmpty()){
            update AccList;
        }
    }
    
    
}
//just checking computer speed