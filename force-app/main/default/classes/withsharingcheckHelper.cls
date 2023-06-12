public  with sharing class withsharingcheckHelper {
    
     public static void udpateAcc(Account acc1) {
         Contact con= [SELECT Secret_Key__c FROM Contact WHERE id = '0030o00003qvzXp' ];
         
        // if(con.Contact == null){
          con.Secret_Key__c = 'Test'+DateTIME.Now();
          update con;
          //}
     }
}