({
	helperMethod : function() {
		
	},
    
    getShipperCodes: function(component, event) {
        
        // get the contactList from component and add(push) New Object to List  
        var RowItemList;
        var dispatchId      = component.get("v.dispatchID");
        var action = component.get("c.getShipperCodeDetails");
        //alert(' Dispatch id Shipper '+ dispatchId);
        action.setParams({
            "dispatchID"       : dispatchId
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") { 
                console.log(' Success happened');
                component.set("v.shipperCodeList", response.getReturnValue());
            }
            
        }); 
        $A.enqueueAction(action);
    },
    
    addRow: function(component, event) {
        var RowItemList = component.get("v.shipperCodeList");
        var action      = component.get("c.addNewRowShipperCode");
        component.set("v.Spinner", true);
        action.setParams({"incomingShipperCodes_List": component.get("v.shipperCodeList")});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {            
                var shipperCodesList = response.getReturnValue();
                var lengthOfList              = shipperCodesList.length;
                if(lengthOfList != 0){
                    component.set("v.shipperCodeList", response.getReturnValue());
                }
            }
            
        });
        $A.enqueueAction(action);
    },
    
    createObjectData: function(component, event) {
        // get the contactList from component and add(push) New Object to List  
        var RowItemList = component.get("v.shipperCodeList");
        RowItemList.push({
            'sobjectType': 'Shipper_codes__c'
            
        });
        // set the updated list to attribute (contactList) again    
        component.set("v.shipperCodeList", RowItemList);
    },
})