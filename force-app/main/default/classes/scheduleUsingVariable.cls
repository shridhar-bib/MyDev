public with sharing class scheduleUsingVariable implements Schedulable{
    String test1 = '';
    public void execute(SchedulableContext sc) {
        System.debug('=test1==='+test1);
        Mini_Tower__c mt = [SELECT Name FROM Mini_Tower__c WHERE Id = 'a090o00003MEcek'];
        mt.Name = test1;
        update mt;
   }

   public scheduleUsingVariable(string test){
        test1 = test;
   }
    public scheduleUsingVariable(){
   }
}