({
    myAction: function (component, event, helper) {

    },

    // function call on component Load
    doInit: function (component, event, helper) {
        // create a Default RowItem [Contact Instance] on first time Component Load
        // by call this helper function        
        helper.getDeliveryInstructions(component, event);
           
    },

    // function for save the Records 
    Save: function (component, event, helper) {
        var AllRowsList = component.get("v.deliveryInstructionList");
        var dispatchId = component.get("v.dispatchID");
        var action = component.get("c.SaveDeliveryInstructions");

        action.setParams({
            "incomingDeliveryInstructions_List": AllRowsList,
            "DispatchID": dispatchId

        });

        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log(' Save Success ');
                var deliveryInstructionsRecords = response.getReturnValue();
                console.log(' Return values ' + deliveryInstructionsRecords);
                component.set("v.deliveryInstructionList", response.getReturnValue());

            }

        });
        $A.enqueueAction(action);
    },

    // function for create new object Row in Contact List 
    addNewRow: function (component, event, helper) {
        // call the comman "createObjectData" helper method for add new Object Row to List  
        helper.addRow(component, event);
    },

    // function for delete the row 
    removeDeletedRow: function (component, event, helper) {
        // get the selected row Index for delete, from Lightning Event Attribute  
        var index = event.getParam("indexVar");
        // get the all List (contactList attribute) and remove the Object Element Using splice method    
        var AllRowsList = component.get("v.deliveryInstructionList");
        AllRowsList.splice(index, 1);
        // set the contactList after remove selected row element  
        component.set("v.deliveryInstructionList", AllRowsList);
    },
})