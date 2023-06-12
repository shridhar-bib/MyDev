public with sharing class TestPractice {
    
    
    @auraEnabled
    public static string returnValue(String value){

        return value+Datetime.now();
    }
}