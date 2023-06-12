({
    doInit : function(component, event, helper) {

    },
    handleApprove : function(component, event, helper) {
        helper.approveOrRejectHelper(component, event, helper, 'Approve');
    },
    handleReject : function(component, event, helper) {
        helper.approveOrRejectHelper(component, event, helper, 'Reject');
    }
})