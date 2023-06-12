({
    // To redirect to the URL, JS method Window.open is using, because the force.com event lightning:navigate or $A.get("e.force:navigateToURL")
    // has some isses as it wont refreshes the form, it redirects to the form but dispays the record details of previously
    // open record.
    doInit: function (component, event, helper) {
        var self = helper;
        var recordId = component.get("v.recordId");
        var sObjectName = component.get("v.sObjectName");
        helper.domainUrl = window.location.origin;

        var queryString = 'SELECT Id, Opportunity__r.StageName, Name FROM Dispatch_Instruction__c WHERE Opportunity__c =\'' + recordId + '\' ORDER BY CreatedDate DESC NULLS LAST';;


        self.callApexController(component, "querySObjects", {
            queryString: queryString
        }).then(function (responseRecord) {
            if (responseRecord != undefined && responseRecord.length > 0) {
                component.set("v.dispatch", responseRecord[0]);
            } else {
                var queryoppString = 'SELECT Id, StageName FROM Opportunity  WHERE Id =\'' + recordId + '\'';
                return self.callApexController(component, "querySObjects", {
                    queryString: queryoppString
                });
            }
        }).then(function (oppRecord) {
            if (oppRecord != undefined && oppRecord.length > 0) {
                if (oppRecord[0].StageName == 'Closed Won') {
                    window.open(helper.domainUrl + '/lightning/cmp/c__DIA_DispatchPage?c__recordId=' + recordId + '&c__sObjectName=' + sObjectName, '_parent');
                } else {
                    $A.get("e.force:closeQuickAction").fire();
                    helper.showToast(component, event, 'Error', 'Dispatch can be created only for Won opportunities', 'error');
                }
            } else if (sObjectName == 'Dispatch_Instruction__c'){
                window.open(helper.domainUrl + '/lightning/cmp/c__DIA_DispatchPage?c__recordId=' + recordId + '&c__sObjectName=' + sObjectName, '_parent');
            }
        }).catch(function (error) {
            console.log(error.errormessage);
            helper.showToast(component, event, 'Error', error.errormessage, 'error');
        });

    },
    navigateToDispacthForm: function (component, event, helper) {
        var dispatch = component.get("v.dispatch");
        var sObjectName = 'Dispatch_Instruction__c';

        // var dispatchFormUrl = 'https://shell-energy-wona--gasops.lightning.force.com/lightning/cmp/c__DIA_DispatchPage?c__recordId=' + dispatch["Id"] + '&c__sObjectName=' + sObjectName;
        // // Uses the pageReference definition in the init handler
        // var pageReference = {
        //     "type": "standard__component",
        //     "attributes": {
        //         "componentName": "c__DIA_DispatchPage"
        //     },
        //     "state": {
        //         "c__recordId": dispatch["Id"],
        //         "c__sObjectName": sObjectName
        //     }
        // }
        // var navService = component.find("navService");
        // event.preventDefault();
        // navService.navigate(pageReference);

        window.open(helper.domainUrl + '/lightning/cmp/c__DIA_DispatchPage?c__recordId=' + dispatch["Id"] + '&c__sObjectName=' + sObjectName, '_parent');
    }

})