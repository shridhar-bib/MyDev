({
    doInit : function(component, event, helper) {

    },

    enableBox: function (component, event, helper) {
        var inputField = event.getParam("checked");
        component.set("v.regentRuleDisable", inputField);

        var dispatchObject = component.get("v.dispatchObject");
        dispatchObject["IsMultiMarket"] = inputField;

    },
    enableBox1: function (component, event, helper) {
        var inputField = event.getParam("checked");
        component.set("v.includesTransportation", inputField);

        var dispatchObject = component.get("v.dispatchObject");
        dispatchObject["IncludesTransportation"] = inputField;
    }
})