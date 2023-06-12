({
	helperMethod : function() {
		
	},
    
    getDeliveryInstructions: function(component, event) {
        
        // get the contactList from component and add(push) New Object to List  
        var RowItemList;
        var dispatchId      = component.get("v.dispatchID");
        var action = component.get("c.getDeliveryInstruction");
                
        action.setParams({
            "dispatchID"       : dispatchId
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") { 
                console.log(' Success happened');
                component.set("v.deliveryInstructionList", response.getReturnValue());
            }
            
        }); 
        $A.enqueueAction(action);
    },
    
    addRow: function(component, event) {
        var RowItemList = component.get("v.deliveryInstructionList");
        var action      = component.get("c.addNewRowDeliveryInstruction");
        component.set("v.Spinner", true);
        action.setParams({"incomingDeliveryInstructions_List": component.get("v.deliveryInstructionList")});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {            
                var deliverInstructionsList = response.getReturnValue();
                var lengthOfList              = deliverInstructionsList.length;
                if(lengthOfList != 0){
                    component.set("v.deliveryInstructionList", response.getReturnValue());
                }
            }
            
        });
        $A.enqueueAction(action);
    },
    
})