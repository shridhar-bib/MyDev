/* 
*   Name: DIA_BaseController_Test
*   Description : Test class to cover the Base controller of DIA
*   Author : (Shridhar M)
*
*   History :
*   VERSION     AUTHOR          DATE        DETAIL              UserStory/Req#
*   1.0 -       Shridhar M      21/01/2021  INITIAL DEVELOPMENT
*/
@isTest
private class DIA_BaseController_Test {
    /*
        Description -  Set up method to create all the required records to test DIA_BaseController
    */
    @testSetup static void createSetUpData() {
        // create account
        List<Account> accountList = DIA_TestDataFactory.createAccount(2);
        insert accountList;
    }

    /*
        Description -  This method covers fetchFieldSetDetails() and fetchFieldSetDetailsForTable()
        fetchFieldSetDetails() - THis method returns the field set details for given object name and field set
        fetchFieldSetDetailsForTable() - THis method returns the field set details, this is called from DIA_BaseComponent where the result is sent in 
		                                wrapper and the fields detilils are cahnges into colomn obhect used oin lightning DataTable
    */
    static testMethod void testFetchFieldSetDetails(){
        Test.startTest();
        DIA_ResponseWrapper responseWrapper =  DIA_BaseController.fetchFieldSetDetailsForTable('Contract__c', 'DIA_Dispatchpage_LeftColumn');

        System.assertEquals(True, responseWrapper.status);
        Test.stopTest();
    }

    /*
        Description -  This method covers querySObjects()
        querySObjects() - //Called from aura compnent to query sobject without writing apex code everytime
    */
    static testMethod void testQuerySObjects(){
        String queryString = 'SELECT Name FROM Account WHERE Name = \'TestACC1\'';

        Test.startTest();
        List<Account> accList = (List<Account>)DIA_BaseController.querySObjects(queryString);

        System.assertEquals('TestACC1', accList[0].Name);
        Test.stopTest();
    }

    /*
        Description -  This method covers getPicklistOptions()
        getPicklistOptions() - This methods returns the piclist options for given object name and field name
    */
    static testMethod void testGetPicklistOptions(){
        Test.startTest();
        DIA_ResponseWrapper responseWrapper =  DIA_BaseController.getPicklistOptions('Dispatch_Instruction__c', 'Status__c');
        
        System.assertEquals(True, responseWrapper.status);
        Test.stopTest();
    }

    /*
        Description -  This method covers insertSObjects()
        insertSObjects() - Called from aura compnent to insert sobject without writing apex code everytime
    */
    static testMethod void testInsertSObjects(){
        List<Account> accountList = DIA_TestDataFactory.createAccount(2);
        
        Test.startTest();
        DIA_ResponseWrapper responseWrapper =  DIA_BaseController.insertSObjects(accountList, true);
        List<Account> accList1 = [SELECT Name FROM Account WHERE Name = 'TestACC2'];
        
        System.assertEquals('TestACC2', accList1[0].Name);
        
        // Negative senario
        accountList = DIA_TestDataFactory.createAccount(1);
        accountList[0].Local_Sales_Office__c = null;
        responseWrapper =  DIA_BaseController.insertSObjects(accountList, false);
        Database.SaveResult[] results = (List<Database.SaveResult>)JSON.deserialize(responseWrapper.data, List<Database.SaveResult>.class);
        
        System.assertEquals('The local sales office or business area must be selected', results[0].getErrors()[0].getMessage());

        Test.stopTest();
    }

    /*
        Description -  This method covers upsertSObjects()
        upsertSObjects() - Called from aura compnent to insert sobject without writing apex code everytime
    */
    static testMethod void testUpsertSObjects(){
        List<Account> accList = [SELECT Name, Local_Sales_Office__c FROM Account WHERE Name = 'TestACC2'];
        for(Account acc : accList){
            acc.Local_Sales_Office__c = 'SEGA';
        }
        
        Test.startTest();
        DIA_ResponseWrapper responseWrapper =  DIA_BaseController.upsertSObjects(accList, true);
        List<Account> accList1 = [SELECT Name, Local_Sales_Office__c FROM Account WHERE Name = 'TestACC2'];
        
        System.assertEquals('SEGA', accList1[0].Local_Sales_Office__c);
        
        // Negative senario
        for(Account acc : accList1){
            acc.Local_Sales_Office__c = null;
        }
        responseWrapper =  DIA_BaseController.upsertSObjects(accList1, false);
        Database.SaveResult[] results = (List<Database.SaveResult>)JSON.deserialize(responseWrapper.data, List<Database.SaveResult>.class);
        
        System.assertEquals('The local sales office or business area must be selected', results[0].getErrors()[0].getMessage());
        
        Test.stopTest();
    }

    /*
        Description -  This method covers getRecTypeId() and fetchRecTypeId()
        fetchRecTypeId() - returns the record type id for given record type label
        getRecTypeId() - returns the record type id for given record type label and can be called from lightnign comp by 
    	                    extending DIA_basedcomponent
    */
    static testMethod void testGetRecTypeId(){
        
        
        Test.startTest();
        DIA_ResponseWrapper responseWrapper =  DIA_BaseController.getRecTypeId('Account', 'SEEL Standard Account');
        Schema.DescribeSObjectResult sobjectResult = Schema.getGlobalDescribe().get('Account').getDescribe();
        String recordTypeId = sobjectResult.getRecordTypeInfosByName().get('SEEL Standard Account').getRecordTypeId();
        
        System.assertEquals(recordTypeId, JSON.deserialize(responseWrapper.data, String.class) );
        Test.stopTest();
    }
}