({
    doInit: function (component, event, helper) {
        // helper.doInit(component, event, helper);
    },
    onChangeOfExtraStorage: function (component, event, helper) {
        // var extraStorageCapacity = event.getParam("value");
        // if (extraStorageCapacity == 'YES'){
        //     component.find("Instruction_of_extra_storage").set("v.disabled", false);
        //     component.find("additional_transport_capacity").set("v.disabled", false);
        // }else{  
        //     component.find("Instruction_of_extra_storage").set("v.disabled", true);
        //     component.find("additional_transport_capacity").set("v.disabled", true);
        //     component.find("additional_transport_capacity").set("v.value", 'NO');
        //     component.find("Instruction_for_extra_transport_capacity").set("v.disabled", true)
        // }
    },
    onChangeAdditionalCapacity: function (component, event, helper) {
        // var additionalCapacity = event.getParam("value");
        // if (additionalCapacity == 'YES'){
        //     component.find("Instruction_for_extra_transport_capacity").set("v.disabled", false)
        // }else{  
        //     component.find("Instruction_for_extra_transport_capacity").set("v.disabled", true)
        // }
    },
    onSubmit: function (component, event, helper) {
        // helper.onSubmitHelper(component, event, helper);
    },
    onSuccess: function (component, event, helper) {
        // helper.onSuccessHelper(component, event, helper);
    },
    onError: function (component, event, helper) {
        // helper.onErrorHelper(component, event, helper);
    }

})