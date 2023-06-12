({
    doInit: function (component, event, helper) {
        helper.doInit(component, event, helper);
    },
    onChangeOfContractFields: function (component, event, helper) {
        var dispatchRecord = component.get("v.dispatchRecord");
        var fieldName = event.getSource().get("v.fieldName");
        if (fieldName == 'Volume__c') {
            dispatchRecord['WorkingGasVolume'] = event.getSource().get("v.value");
        } else if (fieldName == 'Units__c') {
            dispatchRecord['WorkingGasUnit'] = event.getSource().get("v.value");
        } else if (fieldName == 'Storage_Capacity_Type_Held__c') {
            dispatchRecord['capacityType'] = event.getSource().get("v.value");
        } else if (fieldName == 'Extra_Storage_Capacity_Bookings__c') {
            dispatchRecord['ExtraStorageCapacityBookings'] = event.getSource().get("v.value");
        } else if (fieldName == 'Contract_Storage__c') {
            dispatchRecord['FacilityName'] = event.getSource().get("v.value");
        } else if (fieldName == 'Start_date__c') {
            dispatchRecord['StartDate'] = event.getSource().get("v.value");
        } else if (fieldName == 'End_date__c') {
            dispatchRecord['EndDate'] = event.getSource().get("v.value");
        } else if (fieldName == 'CurrencyIsoCode') {
            dispatchRecord['ContractCurrency'] = event.getSource().get("v.value");
        }

        component.set("v.dispatchRecord", dispatchRecord);
    },
    "onSubmit": function (component, event, helper) {
        helper.showSpinner(component, event, 'contractSpinner');
    },
    "onSuccess": function (component, event, helper) {
        var dispatchRecord = component.get("v.dispatchRecord");

        if (component.get("v.contractRecordId") == undefined || component.get("v.contractRecordId") == '') {
            helper.showToast(component, event, 'Success', 'Contract Created Successfully', 'success');
        }else{
            helper.showToast(component, event, 'Success', 'Contract Updated Successfully', 'success');
        }

        component.set("v.contractRecordId", event.getParam("response")["id"]);
        dispatchRecord['contractRecordId'] = event.getParam("response")["id"];
        component.set("v.dispatchRecord", dispatchRecord);

        helper.hideSpinner(component, event, 'contractSpinner');
    },
    "onError": function (component, event, helper) {
        if (event.getParam("detail") != undefined) {
            helper.showToast(component, event, 'Error', event.getParam("detail"), 'error');
        } else {
            helper.showToast(component, event, 'Error', 'Error occurred during contract creation', 'error');
        }
        helper.hideSpinner(component, event, 'contractSpinner');
    },

    "onuploadfinished": function (component, event, helper) {
        helper.showToast(component, event, 'Success', 'File Uploaded Successfully', 'success');
    }
})