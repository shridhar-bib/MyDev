({
    doInit: function (component, event, helper) {
    },
    onSubmit: function (component, event, helper) {
        event.preventDefault();
        helper.getContacts(component, event, helper)
    },
    addSelected: function (component, event, helper) {
        helper.addSelectedRows(component, event, helper)
    }
})