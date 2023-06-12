({
	myAction : function(component, event, helper) {
		
	},
    
    doInit: function(component, event, helper) {
        
        var action = component.get("c.getPicklistvalues");
        
        action.setParams({
        	"objectName": 'Fee__c',
            "field_apiname": 'Fee_Type__c',
            "nullRequired": true
        });
        var opts=[];
        action.setCallback(this, function(response) {
            
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
 
                if (allValues != undefined && allValues.length > 0) {
                    opts.push({
                        class: "optionClass",
                        label: "--- None ---",
                        value: ""
                    });
                }
                for (var i = 0; i < allValues.length; i++) {
                    opts.push({
                        class: "optionClass",
                        label: allValues[i],
                        value: allValues[i]
                    });
                }
                component.find('InputFeeType').set("v.options", opts);
            }
            
        
        });
        
        var action2 = component.get("c.getPicklistvalues");
        
        action2.setParams({
        	"objectName": 'Fee__c',
            "field_apiname": 'CurrencyIsoCode',
            "nullRequired": true
        });
        var opts1=[];
        action2.setCallback(this, function(response) {
            
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
 
                if (allValues != undefined && allValues.length > 0) {
                    opts1.push({
                        class: "optionClass",
                        label: "--- None ---",
                        value: ""
                    });
                }
                for (var i = 0; i < allValues.length; i++) {
                    opts1.push({
                        class: "optionClass",
                        label: allValues[i],
                        value: allValues[i]
                    });
                }
                component.find('InputCurrency').set("v.options", opts1);
            }
            
        
        });
        
        var action3 = component.get("c.getPicklistvalues");
        
        action3.setParams({
        	"objectName": 'Fee__c',
            "field_apiname": 'Unit__c',
            "nullRequired": true
        });
        var opts=[];
        action3.setCallback(this, function(response) {
            
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
 
                if (allValues != undefined && allValues.length > 0) {
                    opts.push({
                        class: "optionClass",
                        label: "--- None ---",
                        value: ""
                    });
                }
                for (var i = 0; i < allValues.length; i++) {
                    opts.push({
                        class: "optionClass",
                        label: allValues[i],
                        value: allValues[i]
                    });
                }
                component.find('InputUnit').set("v.options", opts);
            }
            
        
        });
        
        $A.enqueueAction(action);
        $A.enqueueAction(action2); 
        $A.enqueueAction(action3);
    },
    
    AddNewRow : function(component, event, helper){
       // fire the AddNewRowEvt Lightning Event 
        component.getEvent("AddRowEvt").fire();     
    },
    
    removeRow : function(component, event, helper){
     // fire the DeleteRowEvt Lightning Event and pass the deleted Row Index to Event parameter/attribute
       component.getEvent("DeleteRowEvt").setParams({"indexVar" : component.get("v.rowIndex") }).fire();
    },
})