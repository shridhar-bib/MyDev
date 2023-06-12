({
	helperMethod : function() {
		
	},
    
    getFee: function(component, event) {
        
        // get the contactList from component and add(push) New Object to List  
        var RowItemList ;
        var dispatchId      = component.get("v.dispatchID");
        var dispatchRecordFromPage = component.get("v.dispatchRecord");
        var startdate = dispatchRecordFromPage["StartDate"];
        var enddate = dispatchRecordFromPage["EndDate"];
        var contractCurrency = dispatchRecordFromPage["ContractCurrency"];
        var units = dispatchRecordFromPage["WorkingGasUnit"];
        
        var dispatchRecordPrepopulate = JSON.stringify(dispatchRecordFromPage);
        var action = component.get("c.getFeeDetails");
        console.log( ' Dispatch from page '+ dispatchRecordFromPage)
        
        action.setParams({
            "dispatchID"       : dispatchId,
            "startDate"   : startdate,
            "EndDate"       : enddate,
            "ContractCurrency"   : contractCurrency,
            "Unit"   : units,
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") { 
                console.log(' Success happened');
                component.set("v.FeeList", response.getReturnValue());                 
            }
            
        }); 
        $A.enqueueAction(action);
    },
    
    addRow: function(component, event) {
        var RowItemList = component.get("v.FeeList");
        var action      = component.get("c.addNewRowFee");
        
        var dispatchRecordFromPage = component.get("v.dispatchRecord");
        var startdate = dispatchRecordFromPage["StartDate"];
        var enddate = dispatchRecordFromPage["EndDate"];
        var contractCurrency = dispatchRecordFromPage["ContractCurrency"];
        var units = dispatchRecordFromPage["WorkingGasUnit"];
        
        component.set("v.Spinner", true);
        action.setParams({
            "incomingFee_List": component.get("v.FeeList"),
            "startDate"   : startdate,
            "EndDate"       : enddate,
            "ContractCurrency"   : contractCurrency,
            "Unit"   : units,
                         
                         
                         });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {            
                var feeList = response.getReturnValue();
                var lengthOfList = feeList.length;
                if(lengthOfList != 0){
                    component.set("v.FeeList", response.getReturnValue());
                }
            }
            
        });
        $A.enqueueAction(action);
    },
    
    createObjectData: function(component, event) {
        // get the contactList from component and add(push) New Object to List  
        var RowItemList = component.get("v.FeeList");
        RowItemList.push({
            'sobjectType': 'Fee__c'
            
        });
        // set the updated list to attribute (contactList) again    
        component.set("v.FeeList", RowItemList);
    },
})