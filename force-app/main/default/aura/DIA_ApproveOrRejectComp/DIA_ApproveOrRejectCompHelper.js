({
    approveOrRejectHelper: function (component, event, helper, approverAction) {
        helper.showSpinner(component, event, 'approveRejectSpinner');
        var diaId = component.get("v.recordId");

        var workItemParameterMap = {
            comments: component.get("v.comments"),
            actionType: approverAction,
            recordId: diaId
        };


        helper.callApexController(component, "approveRejectRecord", {
            workItemParameterMapString: JSON.stringify(workItemParameterMap)
        }).then(function (response) {
            helper.hideSpinner(component, event, 'approveRejectSpinner');
            if (response.status == true) {
                if (approverAction == 'Approve') {
                    helper.showToast(component, event, 'Success', 'Dispatch is Approved', 'success');
                } else {
                    helper.showToast(component, event, 'Success', 'Dispatch is Rejected', 'success');
                }
                var domainUrl = window.location.origin;
                setTimeout(() => {
                    window.open(domainUrl + '/lightning/r/Dispatch_Instruction__c/' + diaId + '/view', '_parent');
                }, 1000);
            } else {
                helper.showToast(component, event, 'Error', response.errormessage, 'error');
            }


        }).catch(function (error) {
            helper.showToast(component, event, 'Error', error, 'error');
            helper.hideSpinner(component, event, 'approveRejectSpinner');
            $A.get("e.force:closeQuickAction").fire();
        });


    },
    rejectHelper: function (component, event, helper) {
        helper.showToast1(component, event, 'Success', 'Dispatch is rejected', 'error');
    }
})