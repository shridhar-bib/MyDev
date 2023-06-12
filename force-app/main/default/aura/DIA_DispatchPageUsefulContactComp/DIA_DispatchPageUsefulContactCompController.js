({
    doInit: function (component, event, helper) {
        helper.doInit(component, event, helper);
    },
    handleAddContactButton: function (component, event, helper) {
        // helper.addContact(component, event, helper);
        // https://shell-energy-wona--gasops.lightning.force.com/lightning/o/Contact/new
        window.open("https://shell-energy-wona--gasops.lightning.force.com/lightning/o/Contact/new");
    },
    handleSearchContactButton: function (component, event, helper) {
        helper.searchContacts(component, event, helper);
    },
    handleRemoveContactButton: function (component, event, helper) {
        helper.removeContacts(component, event, helper);
    },
    refreshView: function (component, event, helper) {
        helper.doInit(component, event, helper);
    },
    createRecord: function (component, event, helper) {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Contact"
        });
        createRecordEvent.fire();
    }
})