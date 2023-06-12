({
    doInit: function (component, event, helper) {
        var self = helper;
        var fieldstoQuery = [];
        var colFieldList = [];
        var dispatchObject = component.get("v.dispatchObject");

        helper.showSpinner(component, event, 'addContactSpinner');

        self.getDataTableColDataFromFieldset(component, event, 'Contact', 'DIA_Dispatchpage_ContactTableHeader'
        ).then(function (Response) {
            if (Response != undefined && Response.data.length > 0) {
                var fieldList = Response.data;
                for (var i = 0; i < fieldList.length; i++) {
                    colFieldList.push({
                        label: fieldList[i].label,
                        fieldName: fieldList[i].fieldName,
                        type: fieldList[i].type,
                    });
                    fieldstoQuery.push(fieldList[i].fieldName);
                }
                var queryString = '';
                if (dispatchObject["Id"] != undefined) {
                    queryString += 'SELECT Contact__c,Dispatch_Instruction__c FROM Useful_Contact__c WHERE Dispatch_Instruction__c =\'' + dispatchObject["Id"] + '\'';
                    return self.callApexController(component, "querySObjects", {
                        queryString: queryString
                    })
                }
            } else {

            }
        }).then(function (cusefulContacts) {
            if (cusefulContacts != undefined && cusefulContacts.length > 0) {
                var contIdList = [];
                for (var i = 0; i < cusefulContacts.length; i++) {
                    contIdList.push(cusefulContacts[i]["Contact__c"]);
                }
                var contIdListStr = "'" + contIdList.join("','") + "'"
                var queryString = "SELECT " + fieldstoQuery.join() + " FROM Contact WHERE Id IN (" + contIdListStr + ")";

                return self.callApexController(component, "querySObjects", {
                    queryString: queryString
                });
            } else {
            }
        }).then(function (contactList) {
            var aData = [];
            if (contactList != undefined) {
                let dataObj = {};
                for (var i = 0; i < contactList.length; i++) {
                    dataObj = {};
                    for (var j = 0; j < fieldstoQuery.length; j++) {
                        dataObj[fieldstoQuery[j]] = self.getFieldValue(fieldstoQuery[j], contactList[i]);
                    }
                    dataObj['Id'] = self.getFieldValue('Id', contactList[i]);
                    aData.push(dataObj);
                }
            }
            component.set('v.dataList', aData);
            return self.callApexController(component, "fetchFieldSetDetails", {
                objectName: 'contact',
                fieldSetName: 'DIA_Dispatchpage_CreateContactFields'
            });
        }).then(function (createFieldList) {
            component.set("v.contactFieldListForCreateForm", createFieldList);
            component.set("v.colFieldsForSearcTable", colFieldList);
            component.set("v.fieldstoQuery", fieldstoQuery);
            component.set("v.columns", colFieldList);
            helper.hideSpinner(component, event, 'addContactSpinner');
        }).catch(function (error) {
            helper.hideSpinner(component, event, 'addContactSpinner');
        });

    },
    searchContacts: function (component, event, helper) {
        var modalBody;
        $A.createComponent("c:DIA_DispatchPageContactSearchComp", {
            columns: component.get("v.columns"),
            colFieldList: component.get("v.colFieldsForSearcTable"),
            fieldstoQuery: component.get("v.fieldstoQuery"),
            dispatchObject: component.get("v.dispatchObject"),
            reloadTable: component.getReference("v.reloadTable")
        },
            function (content, status) {
                if (status === "SUCCESS") {
                    modalBody = content;
                    component.find('overlayLib').showCustomModal({
                        header: "Add Contacts",
                        body: modalBody,
                        showCloseButton: true,
                        cssClass: "mymodal",
                        closeCallback: function () {
                            // alert('You closed the alert!');
                        }
                    })
                }
            });
    },
    removeContacts: function (component, event, helper) {
        var self = helper;
        var selctedContactList = [];
        var dispatchObject = component.get("v.dispatchObject");
        var tableComp = component.find("contactsTable");
        var selectedRows = tableComp.getSelectedRows();

        // spinner - will be closed do init method, cause in call back this component will be refreshed
        // helper.showSpinner(component, event, 'addContactSpinner');

        for (var i = 0; i < selectedRows.length; i++) {
            selctedContactList.push(selectedRows[i]);

        }

        if (selctedContactList.length > 0) {
            self.callApexController(component, "deleteUsefulContacts", {
                dispatchId: dispatchObject["Id"],
                selctedContactList: selctedContactList,
            }).then(function (Response) {
                if (Response.status) {
                    self.showToast(component, event, 'Success', 'Selected contacts are removed from dispatch', 'success');
                } else {
                    self.showToast(component, event, 'Error', Response.errorMessage, 'error');
                }

                helper.doInit(component, event, helper);
            }).catch(function (error) {
                self.showToast(component, event, 'Error', error, 'error');
                helper.doInit(component, event, helper);
            });
        } else {
            self.showToast(component, event, '', 'Please select the contacts', 'info');
        }
    },
    addContact: function (component, event, helper) {
        var modalBody;
        $A.createComponent("c:DIA_DispatchPageCreateContactComp", {
            contactFieldList: component.get("v.contactFieldListForCreateForm"),
            reloadTable: component.getReference("v.reloadTable")
        },
            function (content, status) {
                if (status === "SUCCESS") {
                    modalBody = content;
                    component.find('overlayLib').showCustomModal({
                        header: "Create New Contact",
                        body: modalBody,
                        showCloseButton: true,
                        cssClass: "mymodal",
                        closeCallback: function () {
                            // alert('You closed the alert!');
                        }
                    })
                }
            });
    }
})