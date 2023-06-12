/* 
*   Name: DIA_DispatchPageController
*   Description : This class is used as a controller for DIA_DispatchPage and its child components
*   Author : (Shridhar M) and (Saravanan P)
*
*   History :
*   VERSION     AUTHOR          DATE        DETAIL              UserStory/Req#
*   1.0 -       Shridhar M      24/12/2020  INITIAL DEVELOPMENT
*	1..0 		Saravanan 		21/1/2020	Module owner for Delivery Instruction, Shipper code, Fee
*/

public with sharing class DIA_DispatchPageController {
    
    //Method to get all the picklist values dynamically
    @AuraEnabled
    public static List<String> getPicklistvalues(String objectName, String field_apiname){
        system.debug(' Calling picklist values '+ field_apiname);
        List<String> optionlist = new List<String>();
        
        Map<String,Schema.SObjectType> gd = Schema.getGlobalDescribe(); 
        Map<String, Schema.SObjectField> field_map = gd.get(objectName.toLowerCase()).getDescribe().fields.getMap(); 
        
        List<Schema.PicklistEntry> picklistValues = field_map.get(field_apiname).getDescribe().getPickListValues();
        
        for (Schema.PicklistEntry pv : picklistValues) {
            optionlist.add(pv.getValue());
        }
        system.debug(' Return values '+ optionlist);
        return optionlist;
    }
    
    //Method to get deliveryinstruction record on load
    @AuraEnabled
    public static List<Delivery_instruction__c> getDeliveryInstruction(String dispatchID){
        system.debug(' # calling getDeliveryInstructions '+ dispatchID );
        List<Delivery_instruction__c> deliveryInstruction_List = new List<Delivery_instruction__c>();
        
        if(dispatchID != null){
            deliveryInstruction_List = [select id,Dispatch_Instruction__c,Market_Area__c,Network_Operator__c,Storage__c,Entry__c,Exit__c from Delivery_instruction__c where Dispatch_Instruction__c =: dispatchID ];
        }
                
        if(deliveryInstruction_List.isEmpty()){
            system.debug(' Dispatch is empty ');
            Delivery_instruction__c newDeliveryInstruction = new Delivery_instruction__c();
            newDeliveryInstruction.Dispatch_Instruction__c = null;
            newDeliveryInstruction.Entry__c = null;
            newDeliveryInstruction.Exit__c = null;
            deliveryInstruction_List.add(newDeliveryInstruction);
        }
        
        system.debug(' # Return getDeliveryInstructions List '+ deliveryInstruction_List + ' Size '+ deliveryInstruction_List.size());
        return deliveryInstruction_List;
    }
    
    //Method to add new row in delivery instruction module
    @AuraEnabled
    public static List<Delivery_instruction__c> addNewRowDeliveryInstruction(List<Delivery_instruction__c> incomingDeliveryInstructions_List){
        
        List<Delivery_instruction__c> deliveryInstruction_List = new List<Delivery_instruction__c>();        
        
        Delivery_instruction__c newDeliveryInstruction = new Delivery_instruction__c();
        newDeliveryInstruction.Dispatch_Instruction__c = incomingDeliveryInstructions_List[0].Dispatch_Instruction__c;
        newDeliveryInstruction.Entry__c = null;
        newDeliveryInstruction.Exit__c = null;        
        
        incomingDeliveryInstructions_List.add(newDeliveryInstruction);
        return incomingDeliveryInstructions_List;
    }
    
    //Method to save delivery instruction
    @AuraEnabled
    public static List<Delivery_instruction__c> SaveDeliveryInstructions(List<Delivery_instruction__c> incomingDeliveryInstructions_List, String DispatchID){
        
        list<Delivery_instruction__c> deliveryInstruction_UpsertList = new list<Delivery_instruction__c>();
        list<Delivery_instruction__c> deliveryInstruction_DeleteList = new list<Delivery_instruction__c>();
        
        if(DispatchID != null || DispatchID != ''){
            deliveryInstruction_DeleteList = [select id from Delivery_instruction__c where Dispatch_Instruction__c =: DispatchID ];
        }
        
        if(!deliveryInstruction_DeleteList.isEmpty()){
            delete deliveryInstruction_DeleteList;
        }
        
        for(Delivery_instruction__c DI: incomingDeliveryInstructions_List)
        {
            Delivery_instruction__c inserDI = new Delivery_instruction__c();            
            inserDI.Dispatch_Instruction__c = DispatchID; 
            inserDI.Market_Area__c = DI.Market_Area__c;
            inserDI.Network_Operator__c = DI.Network_Operator__c;
            inserDI.Storage__c = DI.Storage__c;
            inserDI.Entry__c = DI.Entry__c;
            inserDI.Exit__c = DI.Exit__c;           
            system.debug(' Dispatch after assignment '+ DI.Dispatch_Instruction__c);
            
            deliveryInstruction_UpsertList.add(inserDI);
        }
        
        upsert deliveryInstruction_UpsertList;
        return deliveryInstruction_UpsertList;
    }
    
    // Method to initiatilize shipper code records on load
    @AuraEnabled
    public static List<Shipper_codes__c> getShipperCodeDetails(String dispatchID){
        system.debug(' # calling getShipperCodeDetails '+ dispatchID );
        List<Shipper_codes__c> shipperCode_List = new List<Shipper_codes__c>();
        
        if(dispatchID != null){
            shipperCode_List = [select id,Description__c,Shipper_ID__c,EIC_Code__c from Shipper_codes__c where Dispatch_Instruction__c =: dispatchID ];
        }
                
        if(shipperCode_List.isEmpty()){
            Shipper_codes__c newShipperCode = new Shipper_codes__c();
            newShipperCode.Dispatch_Instruction__c = null;
            newShipperCode.Description__c = null;
            newShipperCode.Shipper_ID__c = null;
            newShipperCode.EIC_Code__c = null;
            shipperCode_List.add(newShipperCode);
        }
        system.debug(' # Return getShipperCode List '+ shipperCode_List + ' Its size '+ shipperCode_List.isEmpty());
        return shipperCode_List;
    }
    
    // Method to add new shipper code row on click of + button
    @AuraEnabled
    public static List<Shipper_codes__c> addNewRowShipperCode(List<Shipper_codes__c> incomingShipperCodes_List){
        
        List<Shipper_codes__c> shipperCode_List = new List<Shipper_codes__c>();        
        
        Shipper_codes__c newShipperCode = new Shipper_codes__c();
        newShipperCode.Dispatch_Instruction__c = incomingShipperCodes_List[0].Dispatch_Instruction__c;
        newShipperCode.Description__c = null;
        newShipperCode.Shipper_ID__c = null;
        newShipperCode.EIC_Code__c = null;
        
        
        incomingShipperCodes_List.add(newShipperCode);
        return incomingShipperCodes_List;
    }
    
    // Method to save shipper code records
    @AuraEnabled
    public static List<Shipper_codes__c> SaveShipperCode(List<Shipper_codes__c> incomingShipperCodes_List, String dispatchID){
        
        system.debug(' Save shipper dispatch id '+ dispatchID);
        list<Shipper_codes__c> shipperCode_UpsertList = new list<Shipper_codes__c>();
        list<Shipper_codes__c> shipperCode_DeleteList = new list<Shipper_codes__c>();
        
        if(dispatchID != null || dispatchID != ''){
            shipperCode_DeleteList = [select id from Shipper_codes__c where Dispatch_Instruction__c =: dispatchID ];
        }
        
        if(!shipperCode_DeleteList.isEmpty()){
            delete shipperCode_DeleteList;
        }
        
        for(Shipper_codes__c SC: incomingShipperCodes_List)
        {
            Shipper_codes__c inserSC = new Shipper_codes__c();            
            inserSC.Dispatch_Instruction__c = dispatchID; 
            inserSC.Description__c = SC.Description__c;
            inserSC.Shipper_ID__c = SC.Shipper_ID__c;
            inserSC.EIC_Code__c = SC.EIC_Code__c;
            
            system.debug(' Dispatch after assignment '+ SC.Dispatch_Instruction__c);
            
            shipperCode_UpsertList.add(inserSC);
        }
        
        upsert shipperCode_UpsertList;
        return shipperCode_UpsertList;
    }
    
    // Method to get fee records on load
    @AuraEnabled
    public static List<Fee__c> getFeeDetails(String dispatchID, String startDate, String EndDate, String ContractCurrency, String Unit){
        system.debug(' # calling getFeeDetails '+ dispatchID );
        system.debug(' incoming currency '+ ContractCurrency);
                
        List<Fee__c> fee_List = new List<Fee__c>();
                
        if(dispatchID != null){
            fee_List = [select id,Dispatch_Instruction__c,Fee_Type__c,Rate__c,Start_date__c,End_date__c,CurrencyIsoCode,Description__c,Unit__c from Fee__c where Dispatch_Instruction__c =: dispatchID ];
        }

        if(fee_List.isEmpty()){
            Fee__c newFee = new Fee__c();
            newFee.Dispatch_Instruction__c = null;
            newFee.Fee_Type__c = null;
            newFee.Rate__c = null;
            newFee.Start_date__c = date.valueOf(startDate);
            newFee.End_date__c = date.valueOf(EndDate);
            newFee.CurrencyIsoCode = ContractCurrency;
            newFee.Unit__c = Unit;
            newFee.Description__c = '';
            fee_List.add(newFee);
        }
        
        system.debug(' # Return getFees List '+ fee_List + ' Size '+ fee_List.size());
        return fee_List;
    }
    
    // Method to add new row of fee
    @AuraEnabled
    public static List<Fee__c> addNewRowFee(List<Fee__c> incomingFee_List, String startDate, String EndDate, String ContractCurrency, String Unit){
        
        List<Fee__c> Fee_List = new List<Fee__c>();        
        
        Fee__c newFee = new Fee__c();
        newFee.Dispatch_Instruction__c = incomingFee_List[0].Dispatch_Instruction__c;
        newFee.Fee_Type__c = null;
        newFee.Rate__c = null;
        newFee.Start_date__c =  date.valueOf(startDate);
        newFee.End_date__c = date.valueOf(EndDate);
        newFee.CurrencyIsoCode = ContractCurrency;
        newFee.Unit__c = Unit;        
        newFee.Description__c = '';
        incomingFee_List.add(newFee);
        return incomingFee_List;
    }
    
    // Method to save fee records
    @AuraEnabled
    public static List<Fee__c> SaveFee(List<Fee__c> incomingFee_List, String DispatchID){
        
        system.debug(' Dispatch id to save '+ DispatchID);
        list<Fee__c> fee_UpsertList = new list<Fee__c>();
        list<Fee__c> fee_DeleteList = new list<Fee__c>();
        
        if(DispatchID != null || DispatchID != ''){
            fee_DeleteList = [select id from Fee__c where Dispatch_Instruction__c =: DispatchID ];
        }
        
        if(!fee_DeleteList.isEmpty()){
            delete fee_DeleteList;
        }
        
        for(Fee__c SC: incomingFee_List)
        {
            
            Fee__c newFee = new Fee__c();
            newFee.Dispatch_Instruction__c = DispatchID;
            newFee.Fee_Type__c = SC.Fee_Type__c;
            newFee.Rate__c = SC.Rate__c;
            newFee.Start_date__c = SC.Start_date__c;
            newFee.End_date__c = SC.End_date__c;
            newFee.CurrencyIsoCode = SC.CurrencyIsoCode;
            newFee.Unit__c = SC.Unit__c;
            
            newFee.Description__c = SC.Description__c;
            fee_UpsertList.add(newFee);
        }
        
        upsert fee_UpsertList;
        return fee_UpsertList;
    }
    
    
    //This method is used to create usefull contacts records for selected contacts
    // usefull contact is jusction object to contact ans dispacth instruction objects
    @AuraEnabled
    public static DIA_ResponseWrapper createUsefulContacts(String dispatchId,List<Map<String, String>> selctedContactList){
        Map<Id , Useful_Contact__c> usefulContactMapExisting = new Map<Id, Useful_Contact__c>();
        Map<String, String> selctedContactsMap = new Map<String, String>();
        
        System.debug('==='+selctedContactList);
        for(Map<String, String> selectedRow : selctedContactList){
            selctedContactsMap.put(selectedRow.get('Id'), selectedRow.get('Name'));
        }
        
        // fetch existing useful contacts to avoid cration of duplicates
        List<Useful_Contact__c> usefulContactList = [SELECT Contact__c, Contact__r.name FROM Useful_Contact__c WHERE Dispatch_Instruction__c =: dispatchId];
        for(Useful_Contact__c usefulContact : usefulContactList){
            usefulContactMapExisting.put(usefulContact.Contact__c, usefulContact);
        }
        
        // prepare usefulcontacts for selected contacts and insert
        List<Useful_Contact__c> usefulContactListToSave = new List<Useful_Contact__c>(); 
        for(Id contactId : selctedContactsMap.keyset()){
            if(!usefulContactMapExisting.containskey(contactId)){
                Useful_Contact__c usefulcontact = new Useful_Contact__c();
                usefulcontact.Contact__c = contactId;
                usefulcontact.Dispatch_Instruction__c = dispatchId;
                usefulcontact.Name = selctedContactsMap.get(contactId);
                
                usefulContactListToSave.add(usefulcontact);
            }
        }
        try {
            if(!usefulContactListToSave.isEmpty()){
                insert usefulContactListToSave;
            }
        } catch (Exception e) {
            return new DIA_ResponseWrapper('', false, e.getMessage());
        }
        
        return new DIA_ResponseWrapper('', true, '');
    }
    //This method is used to delete usefull contacts records for selected contacts
    // usefull contact is jusction object to contact ans dispacth instruction objects
    @AuraEnabled
    public static DIA_ResponseWrapper deleteUsefulContacts(String dispatchId,List<Map<String, String>> selctedContactList){
        Map<Id , Useful_Contact__c> usefulContactMapExisting = new Map<Id, Useful_Contact__c>();
        Map<String, String> selctedContactsMap = new Map<String, String>();
        
        System.debug('==='+selctedContactList);
        for(Map<String, String> selectedRow : selctedContactList){
            selctedContactsMap.put(selectedRow.get('Id'), selectedRow.get('Name'));
        }
        
        System.debug(dispatchId+'==='+selctedContactsMap);
        // fetch  useful contacts careted as juction between selected contacts and dispacth
        List<Useful_Contact__c> usefulContactList = [SELECT Contact__c, Contact__r.name FROM Useful_Contact__c WHERE Dispatch_Instruction__c =: dispatchId AND Contact__c in : selctedContactsMap.keyset()];
        
        try {
            if(!usefulContactList.isEmpty()){
                delete usefulContactList;
            }
        } catch (Exception e) {
            return new DIA_ResponseWrapper('', false, e.getMessage());
        }
        
        return new DIA_ResponseWrapper('', true, '');
    }
    
    // this methos submits the dispacth record for approval 
    @AuraEnabled
    public static DIA_ResponseWrapper submitDispatchForApproval(String dispatchId){
        
        Dispatch_Instruction__c dispatchRec= new Dispatch_Instruction__c(Id=dispatchId, Status__c='Submitted');
        update dispatchRec;
        
        // Create an approval request for the dispatch
        Approval.ProcessSubmitRequest submitReq = new Approval.ProcessSubmitRequest();
        submitReq.setComments('Submitting Dispatch for approval.');
        submitReq.setObjectId(dispatchRec.id);
        
        // Submit on behalf of a specific submitter
        submitReq.setSubmitterId(UserInfo.getUserId()); 
        
        // Submit the approval request for the account
        Approval.ProcessResult result = Approval.process(submitReq);
        
        
        return new DIA_ResponseWrapper('', true, '');
    }
    
    //this method is to approve/reject the perticular approval step in approval process
    @auraEnabled
    public static DIA_ResponseWrapper approveRejectRecord(String workItemParameterMapString){
        Map<String, String> workItemParameterMap = (Map<String, String>)JSON.deserialize(workItemParameterMapString, Map<String, String>.class);
        system.debug('==workItemParameterMap==='+workItemParameterMap);
        
        Approval.ProcessWorkitemRequest request = new Approval.ProcessWorkitemRequest();
        request.setComments(workItemParameterMap.get('comments'));
        request.setAction(workItemParameterMap.get('actionType'));
        
        // Use the ID from the newly created item to specify the item to be worked.
        ProcessInstanceWorkitem  workItem = getWorkItem(workItemParameterMap.get('recordId'));

        if(!String.isblank(workItem.Id)){
            request.setWorkitemId(workItem.Id);
            Approval.ProcessResult result =  Approval.process(request);
            return new DIA_ResponseWrapper(JSON.serialize(result),true,'');
        }else{
            return new DIA_ResponseWrapper('',false,'There is no approval request for this record.');
        }
        
    }
    
    // returns the cuurent approval step details of claim if submitted for approval
    private static ProcessInstanceWorkitem getWorkItem(Id targetObjectId)
    {
        ProcessInstanceWorkitem workItemToReturn = new ProcessInstanceWorkitem();
        for(ProcessInstanceWorkitem workItem  : [Select Id, ActorId from ProcessInstanceWorkitem where ProcessInstance.TargetObjectId =: targetObjectId]) {
            workItemToReturn  =  workItem;
            break;
        }
        return workItemToReturn;
    }
        
    @AuraEnabled
    public static List <DIA_Reference_Data__c> fetchLookUpValues(String searchKeyWord, String FieldAPI) {
        system.debug('FieldAPI-->' + FieldAPI);
        String searchKey = searchKeyWord + '%';
        
        List <DIA_Reference_Data__c> returnList = new List <DIA_Reference_Data__c> ();
      
        // Create a Dynamic SOQL Query For Fetch Record List with LIMIT 5   
        String sQuery =  'select id, Name from DIA_Reference_Data__c where RecordType.Name LIKE: FieldAPI AND Name LIKE: searchKey';
        List <DIA_Reference_Data__c> lstOfRecords = Database.query(sQuery);
        
        for (DIA_Reference_Data__c obj: lstOfRecords) {
            returnList.add(obj);
        }
        return returnList;
    }

    
}