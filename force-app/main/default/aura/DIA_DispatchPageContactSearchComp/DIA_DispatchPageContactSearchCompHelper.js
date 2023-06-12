({
    getContacts: function (component, event, helper) {
        var self = helper;
        var colFieldList = component.get("v.colFieldList");
        var fieldstoQuery = component.get("v.fieldstoQuery");

        var fields = event.getParam("fields");
        var accountId = fields["AccountId"];

        helper.showSpinner(component, event, 'searchContactSpinner');

        var queryString = '';
        if (accountId != undefined) {
            queryString += 'SELECT ' + fieldstoQuery.join() + ' FROM Contact WHERE accountId=\'' + accountId + '\'';
        } else {
            helper.showToast(component, event, '', 'Account is not selected', 'info');
            return
        }

        self.callApexController(component, "querySObjects", {
            queryString: queryString
        }).then(function (contactList) {

            var aData = [];
            let dataObj = {};
            for (var i = 0; i < contactList.length; i++) {
                dataObj = {};
                for (var j = 0; j < fieldstoQuery.length; j++) {
                    dataObj[fieldstoQuery[j]] = self.getFieldValue(fieldstoQuery[j], contactList[i]);
                }
                dataObj["Id"] = self.getFieldValue("Id", contactList[i]);
                aData.push(dataObj);
            }
            component.set("v.columns", colFieldList);
            component.set('v.dataList', aData);
            helper.hideSpinner(component, event, 'searchContactSpinner');
        }).catch(function (error) {
            helper.hideSpinner(component, event, 'searchContactSpinner');
        });
    },
    addSelectedRows: function (component, event, helper) {
        var self = helper;
        var selctedContactList = [];
        var dispatchObject = component.get("v.dispatchObject");
        var tableComp = component.find("contactsSearchTable");
        var selectedRows = tableComp.getSelectedRows();

        for (var i = 0; i < selectedRows.length; i++) {
            selctedContactList.push(selectedRows[i]);
            
        }

        if (selctedContactList.length > 0){
            self.callApexController(component, "createUsefulContacts", {
                dispatchId: dispatchObject["Id"],
                selctedContactList: selctedContactList,
            }).then(function(Response){
                if (Response.status){
                    self.showToast(component, event, 'Success', 'Useful Contacts created and added to the dispacth', 'success');
                }else{
                    self.showToast(component, event, 'Error', Response.errorMessage, 'error');
                }

                component.set("v.reloadTable", new Date());
                component.find("overlayLib").notifyClose();
            }).catch(function(error){
                self.showToast(component, event, 'Error', error, 'error');
                component.set("v.reloadTable", new Date());
                component.find("overlayLib").notifyClose();
            });
        }else{
            self.showToast(component, event, '', 'Please select the contacts', 'info');
        }
    }
})