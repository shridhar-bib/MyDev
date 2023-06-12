/* 
*   Name: DIA_BaseController
*   Description : This is an utility class used in DIA components 
*   Author : (Shridhar M)
*
*   History :
*   VERSION     AUTHOR          DATE        DETAIL              UserStory/Req#
*   1.0 -       Shridhar M      24/12/2020  INITIAL DEVELOPMENT
*/

public with sharing class DIA_BaseController {
    
    /*THis method returns the field set details, this is called from DIA_BaseComponent where the result is sent in 
		wrapper and the fields detilils are cahnges into colomn obhect used oin lightning DataTable
	*/
    @AuraEnabled
    public static DIA_ResponseWrapper fetchFieldSetDetailsForTable(String objectName, String fieldSetName){
        List<FieldSetDetailsWrapper> fieldSetWrapperList = DIA_BaseController.fetchFieldSetDetails(objectName,fieldSetName);
        return new DIA_ResponseWrapper(JSON.serialize(fieldSetWrapperList),true,'');
    }
    
    /*THis method returns the field set details*/
    @AuraEnabled
    public static List<FieldSetDetailsWrapper> fetchFieldSetDetails(String objectName, String fieldSetName){
        List<FieldSetDetailsWrapper> fieldSetDetailsWrapperlst = new List<FieldSetDetailsWrapper>();
        try{
            SObjectType objectType = Schema.getGlobalDescribe().get(objectName);
            Map<String,Schema.SObjectField> fieldsTokenMap = objectType.getDescribe().fields.getMap();
            System.debug('Object Name ' + objectName);
            System.debug('fieldSetName' + fieldSetName);
            System.debug('objectType ' + objectType);
            System.debug('Fieldset ' + objectType.getDescribe().fieldSets.getMap().get(fieldSetName).getFields());
            
            List<Schema.FieldSetMember> fieldSetMemberList =  objectType.getDescribe().fieldSets.getMap().get(fieldSetName).getFields();
            List<String> ignoreFieldList = new List<String>{'CreatedBy','LastModifiedBy'};
                for(Schema.FieldSetMember fieldSetMemberObj : fieldSetMemberList) {
                    FieldSetDetailsWrapper fieldSetDetailsWrapperObj = new FieldSetDetailsWrapper();
                    fieldSetDetailsWrapperObj.label = fieldSetMemberObj.getLabel();
                    fieldSetDetailsWrapperObj.fieldpath = fieldSetMemberObj.getFieldPath();
                    fieldSetDetailsWrapperObj.type = String.valueof(fieldSetMemberObj.getType());
                    String helpText = '';
                    if(fieldSetDetailsWrapperObj.fieldpath.contains('.') && !ignoreFieldList.contains(fieldSetDetailsWrapperObj.fieldpath.split('\\.')[0])) {
                        helpText = '';
                    }else {
                        helpText = (fieldsTokenMap.get(fieldSetDetailsWrapperObj.fieldpath)).getDescribe().getInlineHelpText();
                    }
                    fieldSetDetailsWrapperObj.inlineHelpText = helpText != null ? helpText : '';
                    System.debug('IT '+fieldSetDetailsWrapperObj.inlineHelpText);
                    if(fieldSetDetailsWrapperObj.type==String.valueof(Schema.DisplayType.Reference)) {
                        List<Schema.sObjectType> parentReferenceList = (fieldsTokenMap.get(fieldSetDetailsWrapperObj.fieldpath)).getDescribe().getReferenceTo();
                        List<string> parentReferenceListNames = new List<string>();
                        for(Schema.sObjectType parentreference : parentReferenceList) {
                            parentReferenceListNames.add(parentReferenceList.get(0).getDescribe().getName());
                        }
                        fieldSetDetailsWrapperObj.parentReferenceList = parentReferenceListNames;
                    }
                    fieldSetDetailsWrapperObj.dbrequired = fieldSetMemberObj.getDBRequired();
                    fieldSetDetailsWrapperObj.required = fieldSetMemberObj.getRequired();
                    fieldSetDetailsWrapperlst.add(fieldSetDetailsWrapperObj);
                }
            System.debug(' fieldSetDetailsWrapperlst BC'+fieldSetDetailsWrapperlst);
        } Catch(Exception e){
            System.debug(' Error Message in fetchFieldSetDetails ' + e.getMessage() + ' Line # ' + e.getLineNumber());
        }
        return fieldSetDetailsWrapperlst;
    }
    
    //Called from aura compnent to query sobject without writing apex code everytime
    @AuraEnabled
    public static List<SObject> querySObjects(String queryString){
        List<SObject> sObjList = new List<SObject>();
        try{
            sObjList = Database.query(queryString);
        } Catch(Exception e){
            System.debug(' Error Message ' + e.getMessage() + ' Line # ' + e.getLineNumber());
        }
        return sObjList;
    }
    
    //This methods returns the piclist options
    @AuraEnabled
    public static DIA_ResponseWrapper getPicklistOptions(String objectName, String fieldName) {
        DIA_ResponseWrapper DIA_ResponseWrapperObj = new DIA_ResponseWrapper('',false,'');
        List<PicklistValuesWrapper> picklistValuesWrapperlst = new List<PicklistValuesWrapper>();
        try{
            SObjectType objectType = Schema.getGlobalDescribe().get(objectName);
            Map<String,Schema.SObjectField> fieldsTokenMap = objectType.getDescribe().fields.getMap();
            list<Schema.PicklistEntry> pickListvalues = fieldsTokenMap.get(fieldName).getDescribe().getPickListValues();
            for (Schema.PicklistEntry value: pickListvalues) {
                if(value.isActive()) {
                    PicklistValuesWrapper picklistValuesWrapperObj = new PicklistValuesWrapper();
                    picklistValuesWrapperObj.label = value.getLabel();
                    picklistValuesWrapperObj.value = value.getValue();
                    picklistValuesWrapperObj.active = value.isActive();
                    picklistValuesWrapperObj.defaultvalue = value.isDefaultValue();
                    picklistValuesWrapperlst.add(picklistValuesWrapperObj);
                }
            }
            DIA_ResponseWrapperObj.data = JSON.serialize(picklistValuesWrapperlst);
            DIA_ResponseWrapperObj.status = true;
        } Catch(Exception e){
            DIA_ResponseWrapperObj.errormessage = e.getMessage();
        }
        return DIA_ResponseWrapperObj;
    }
    
    
    //Called from aura compnent to insert sobject without writing apex code everytime
    @AuraEnabled
    public static DIA_ResponseWrapper insertSObjects(List<sObject> sObjectList, boolean allOrNone){
        DIA_ResponseWrapper DIA_ResponseWrapperObj = new DIA_ResponseWrapper('',false,'');
        try{
            Database.SaveResult[] results = Database.Insert(sObjectList,allOrNone);
            DIA_ResponseWrapperObj.data = JSON.serialize(results);
            DIA_ResponseWrapperObj.status = true;
        } Catch(Exception e){
            DIA_ResponseWrapperObj.errormessage = e.getMessage();
            System.debug(' Error Message ' + e.getMessage() + ' Line # ' + e.getLineNumber());
        }
        return DIA_ResponseWrapperObj;
    }
    
    //Called from aura compnent to upsert sobject without writing apex code everytime
    @AuraEnabled
    public static DIA_ResponseWrapper upsertSObjects(List<sObject> sObjectList, boolean allOrNone){
        DIA_ResponseWrapper DIA_ResponseWrapperObj = new DIA_ResponseWrapper('',false,'');
        try{
            Database.upsertResult[] results = Database.upsert(sObjectList,allOrNone);
            DIA_ResponseWrapperObj.data = JSON.serialize(results);
            DIA_ResponseWrapperObj.status = true;
        } Catch(Exception e){
            DIA_ResponseWrapperObj.errormessage = e.getMessage();
            System.debug(' Error Message ' + e.getMessage() + ' Line # ' + e.getLineNumber());
        }
        return DIA_ResponseWrapperObj;
    }
    
    //returns the record tupe id for given record type label
    public static Id fetchRecTypeId(String sObjectAPIName, String recordTypeLabel){
        Schema.DescribeSObjectResult sobjectResult = Schema.getGlobalDescribe().get(sObjectAPIName).getDescribe();
        return sobjectResult.getRecordTypeInfosByName().get(recordTypeLabel).getRecordTypeId();
    }
    
    /*returns the record tupe id for given record type label and can be called from lightnign comp by 
    	extending DIA_basedcomponent
	*/
    @AuraEnabled
    public static DIA_ResponseWrapper getRecTypeId(String sObjectAPIName, String recordTypeLabel){
        DIA_ResponseWrapper DIA_ResponseWrapperObj = new DIA_ResponseWrapper('',false,'');
        try{
            DIA_ResponseWrapperObj.data = JSON.serialize(fetchRecTypeId(sObjectAPIName, recordTypeLabel));
            DIA_ResponseWrapperObj.status = true;
        } catch(exception e) {
            DIA_ResponseWrapperObj.errormessage = e.getMessage();
            System.debug(' Error Message ' + e.getMessage() + ' Line # ' + e.getLineNumber());
        }
        return DIA_ResponseWrapperObj;
    }
    
    
    
    public class FieldSetDetailsWrapper {
        @AuraEnabled
        public string label;
        @AuraEnabled
        public string fieldpath;
        @AuraEnabled
        public string type;
        @AuraEnabled
        public boolean dbrequired;
        @AuraEnabled
        public boolean required;
        @AuraEnabled
        public List<string> parentReferenceList;
        @AuraEnabled
        public String inlineHelpText;
        @AuraEnabled
        public String value;
    }
    
    @TestVisible
    private class PicklistValuesWrapper {
        @AuraEnabled
        public string label;
        @AuraEnabled
        public string value;
        @AuraEnabled
        public boolean active;
        @AuraEnabled
        public boolean defaultvalue;
    }
    
}