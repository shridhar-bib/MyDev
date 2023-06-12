({
	myAction : function(component, event, helper) {
		
	},
    
    doInit: function(component, event, helper) {
        
        var action2 = component.get("c.getPicklistvalues");        
        action2.setParams({
        	"objectName": 'Delivery_instruction__c',
            "field_apiname": 'Storage__c'
            
        });
        var opts2=[];
        action2.setCallback(this, function(response) {
            
            if (response.getState() == "SUCCESS") {
                var allValues2 = response.getReturnValue();
 
                if (allValues2 != undefined && allValues2.length > 0) {
                    opts2.push({
                        class: "optionClass",
                        label: "--- None ---",
                        value: ""
                    });
                }
                for (var i = 0; i < allValues2.length; i++) {
                    opts2.push({
                        class: "optionClass",
                        label: allValues2[i],
                        value: allValues2[i]
                    });
                }
                component.find('InputStorage').set("v.options", opts2);
            }
        });
        
        var action3 = component.get("c.getPicklistvalues");        
        action3.setParams({
        	"objectName": 'Delivery_instruction__c',
            "field_apiname": 'Market_Area__c',
            "nullRequired": true
        });
        var opts3=[];
        action3.setCallback(this, function(response) {
            
            if (response.getState() == "SUCCESS") {
                var allValues3 = response.getReturnValue();
 
                if (allValues3 != undefined && allValues3.length > 0) {
                    opts3.push({
                        class: "optionClass",
                        label: "--- None ---",
                        value: ""
                    });
                }
                for (var i = 0; i < allValues3.length; i++) {
                    opts3.push({
                        class: "optionClass",
                        label: allValues3[i],
                        value: allValues3[i]
                    });
                }
                component.find('InputMarketArea').set("v.options", opts3);
            }
        });
        
        var action4 = component.get("c.getPicklistvalues");        
        action4.setParams({
        	"objectName": 'Delivery_instruction__c',
            "field_apiname": 'Network_Operator__c',
            "nullRequired": true
        });
        var opts4=[];
        action4.setCallback(this, function(response) {
            
            if (response.getState() == "SUCCESS") {
                var allValues4 = response.getReturnValue();
 
                if (allValues4 != undefined && allValues4.length > 0) {
                    opts4.push({
                        class: "optionClass",
                        label: "--- None ---",
                        value: ""
                    });
                }
                for (var i = 0; i < allValues4.length; i++) {
                    opts4.push({
                        class: "optionClass",
                        label: allValues4[i],
                        value: allValues4[i]
                    });
                }
                component.find('InputNetworkOperator').set("v.options", opts4);
            }
        });
        
        $A.enqueueAction(action2);
        $A.enqueueAction(action3);
        $A.enqueueAction(action4);
        
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