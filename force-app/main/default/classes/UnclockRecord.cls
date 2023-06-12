public without sharing class UnclockRecord {

    @InvocableMethod(label='unlock record' description='unlocks' category='Opportunity')
    public static void unlock(List<ID> ids){
        //Get records to unlock
        List<Opportunity> oppList = [SELECT Id From Opportunity WHERE id in : ids];
        //Check locked records
        List<Opportunity> oppLockList = new List<Opportunity>();
        for(Opportunity o :oppList){
            if(Approval.isLocked(o.id)){
                oppLockList.add(o);
            }
        }
        //Unlock record
        if(!oppLockList.isEmpty()){
            //Unlock records
            List<Approval.UnlockResult> ulrList = Approval.unlock(oppLockList, false);
            
            // Iterate through each returned result
            for(Approval.UnlockResult  ulr : ulrList) {
                if (ulr.isSuccess()) {
                    //Operation was successful, so get the ID of the record that was processed
                    System.debug('Successfully locked account with ID: ' + ulr.getId());
                }
                else {
                    //Operation failed, so get all errors                
                    for(Database.Error err : ulr.getErrors()) {
                        System.debug('The following error has occurred.');                    
                        System.debug(err.getStatusCode() + ': ' + err.getMessage());
                        System.debug('Case fields that affected this error: ' + err.getFields());
                    }
                }
            }
        }
    }
}