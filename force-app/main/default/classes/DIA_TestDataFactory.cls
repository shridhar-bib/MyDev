/* 
*   Name: DIA_TestDataFactory
*   Description : Test data factory to use in the DIA test classes
*   Author : (Shridhar M)
*
*   History :
*   VERSION     AUTHOR          DATE        DETAIL              UserStory/Req#
*   1.0 -       Shridhar M      21/01/2021  INITIAL DEVELOPMENT
*/

@isTest
public class DIA_TestDataFactory {
     /*
        Description -  Create generic account to use in all the test classes
    */
    public static List<Account> createAccount(integer recordCount){
        List<Account> lstAccount = new List<Account>();
        Id seelRecorTypeId = DIA_BaseController.fetchRecTypeId('Account', 'SEEL Standard Account');
        for(integer i=0; i<recordCount; i++) {
            Account acc = new Account(Name = 'TestACC'+ (i+1),Local_Sales_Office__c='SEAS',RecordTypeId = seelRecorTypeId, Party_Type__c = 'External');
            
            lstAccount.add(acc);
        }
        return lstAccount;
    }
    
    public static List<Account> createAccountForDeliveryInstruction(integer recordCount){
        List<Account> lstAccount = new List<Account>();
        Id seelRecorTypeId = DIA_BaseController.fetchRecTypeId('Account', 'SEEL Standard Account');
        for(integer i=0; i<recordCount; i++) {
            Account acc = new Account(Name = 'TestACC'+ (i+1),Local_Sales_Office__c='SEAS',RecordTypeId = seelRecorTypeId, Party_Type__c = 'External');
            
            lstAccount.add(acc);
        }
        insert lstAccount;
        return lstAccount;
    }
    
    public static list<Opportunity> createOpportunity(){
        List<Opportunity> lstOpportunity = new list<Opportunity>();
        
        list<Account> acc = DIA_TestDataFactory.createAccountForDeliveryInstruction(1);
        
        system.debug(' Account inserted ' + acc);
        Id gasOriginationRecordTypeId = Schema.SObjectType.Opportunity.getRecordTypeInfosByName().get('Gas Origination').getRecordTypeId();
        
        Opportunity opp = new Opportunity();
        opp.name = 'Test Opportunity';
        opp.AccountId = acc[0].id;
        opp.CurrencyIsoCode = 'EUR';
        opp.RecordTypeId = gasOriginationRecordTypeId;
        opp.Primary_Country__c = 'France';
        opp.StageName = 'Prospecting';
        opp.CloseDate = system.today()+30;
        opp.New_Existing_Business__c = 'New Customer - New Business';
        opp.ForecastCategoryName = 'Best Case';	
        opp.Line_of_Business__c = 'Gas Sales';
        lstOpportunity.add(opp);
        
        insert lstOpportunity;
        system.debug(' Inserted Opp '+ lstOpportunity);
        return lstOpportunity;
    }
    
	public static list<Contract__c> createContract(){
        List<Contract__c> lstContract = new list<Contract__c>();
        
        list<Account> acc = DIA_TestDataFactory.createAccountForDeliveryInstruction(1);
        
        list<Opportunity> opp = DIA_TestDataFactory.createOpportunity();
        
        
        Contract__c contr = new Contract__c();
        contr.Opportunity__c =opp[0].id;
        contr.Contract_Id__c = 'Test1232345';
		contr.Counter_Party__c = acc[0].id;        
        lstContract.add(contr);
        
        insert lstContract;
        system.debug(' Inserted Contract '+ lstContract);
        return lstContract;
    }    
    
    public static list<Dispatch_Instruction__c> createDispatchInstruction(){
        List<Dispatch_Instruction__c> lstDispatchInstruction = new list<Dispatch_Instruction__c>();
        
        list<Account> acc = DIA_TestDataFactory.createAccountForDeliveryInstruction(1);
        
        list<Opportunity> opp = DIA_TestDataFactory.createOpportunity();
        list<Contract__c> contract = DIA_TestDataFactory.createContract();
        
        Dispatch_Instruction__c dispatch = new Dispatch_Instruction__c();
        dispatch.Contract__c = contract[0].id;
		lstDispatchInstruction.add(dispatch);
        
        insert lstDispatchInstruction;
        system.debug(' inserted Dispatch instruction '+ lstDispatchInstruction);
        return lstDispatchInstruction;
    }    
    
    public static list<Delivery_instruction__c> createDeliveryInstruction(){
        List<Delivery_instruction__c> lstDeliveryInstruction = new list<Delivery_instruction__c>();
        
        //list<Account> acc = DIA_TestDataFactory.createAccountForDeliveryInstruction(1);
        
        //list<Opportunity> opp = DIA_TestDataFactory.createOpportunity();
        //list<Contract__c> contract = DIA_TestDataFactory.createContract();
        //List<Dispatch_Instruction__c> dispatchInst = DIA_TestDataFactory.createDispatchInstruction();
            
        List<Account> lstAccount = new List<Account>();
        Id seelRecorTypeId = DIA_BaseController.fetchRecTypeId('Account', 'SEEL Standard Account');        
        Account acc = new Account(Name = 'TestACC',Local_Sales_Office__c='SEAS',RecordTypeId = seelRecorTypeId, Party_Type__c = 'External');            
                
        insert acc;
        
        Id gasOriginationRecordTypeId = Schema.SObjectType.Opportunity.getRecordTypeInfosByName().get('Gas Origination').getRecordTypeId();
        
        Opportunity opp = new Opportunity();
        opp.name = 'Test Opportunity';
        opp.AccountId = acc.id;
        opp.CurrencyIsoCode = 'EUR';
        opp.RecordTypeId = gasOriginationRecordTypeId;
        opp.Primary_Country__c = 'France';
        opp.StageName = 'Prospecting';
        opp.CloseDate = system.today()+30;
        opp.New_Existing_Business__c = 'New Customer - New Business';
        opp.ForecastCategoryName = 'Best Case';	
        opp.Line_of_Business__c = 'Gas Sales';
        insert opp;
        
        Contract__c contr = new Contract__c();
        contr.Opportunity__c =opp.id;
        contr.Contract_Id__c = 'Test1232345';
		contr.Counter_Party__c = acc.id;        
                
        insert contr;
        
        Dispatch_Instruction__c dispatch = new Dispatch_Instruction__c();
        dispatch.Contract__c = contr.id;
        
        insert dispatch;
        
        Delivery_instruction__c deliveryInstruction = new Delivery_instruction__c();
        deliveryInstruction.Dispatch_Instruction__c = dispatch.id;
        deliveryInstruction.Market_Area__c = 'Gaspool';
        deliveryInstruction.Network_Operator__c = 'Gasunie';
        deliveryInstruction.Storage__c = 'Uelsen';
        deliveryInstruction.Entry__c = '2';
        deliveryInstruction.Exit__c = '3';
		lstDeliveryInstruction.add(deliveryInstruction);
        
        insert lstDeliveryInstruction;
        system.debug(' Inserted Delivery Instruction '+ lstDeliveryInstruction);
        return lstDeliveryInstruction;
    }  
}