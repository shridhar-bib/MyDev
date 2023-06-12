({
    doInit: function (component, event, helper) {
        var self = helper;
        var leftColumnFieldList;
        var fieldsetList = component.get("v.fieldsetList");
        var contractRecord = component.get("v.contractRecord");
        
        self.callApexController(component, "fetchFieldSetDetails", {
            objectName: 'Contract__c',
            fieldSetName: 'DIA_Dispatchpage_LeftColumn'
        }).then(function (leftColumnFieldList) {
            fieldsetList = leftColumnFieldList;
            return self.callApexController(component, "fetchFieldSetDetails", {
                objectName: 'Contract__c',
                fieldSetName: 'DIA_Dispatchpage_RightColumn'
            });
        }).then(function (rightColumnFieldList) {
            var evenIndex = 1;
            if (rightColumnFieldList != undefined) {
                for (var i = 0; i < rightColumnFieldList.length; i++) {
                    fieldsetList.splice(evenIndex, 0, rightColumnFieldList[i]);
                    evenIndex = evenIndex + 2;
                }
            }
            for (var i = 0; i < fieldsetList.length; i++) {
                if (fieldsetList[i].fieldpath == 'Start_date__c'){
                    fieldsetList[i]['value'] = contractRecord['Start_date__c'];
                } else if (fieldsetList[i].fieldpath == 'End_date__c'){
                    fieldsetList[i]['value'] = contractRecord['End_date__c'];
                } else if (fieldsetList[i].fieldpath == 'Counter_Party__c') {
                    fieldsetList[i]['value'] = contractRecord['Counter_Party__c'];
                } else if (fieldsetList[i].fieldpath == 'Units__c') {
                    fieldsetList[i]['value'] = contractRecord['Units__c'];
                } else if (fieldsetList[i].fieldpath == 'Volume__c') {
                    fieldsetList[i]['value'] = contractRecord['Volume__c'];
                } else if (fieldsetList[i].fieldpath == 'Buy_Sell__c') {
                    fieldsetList[i]['value'] = contractRecord['Buy_Sell__c'];
                } else if (fieldsetList[i].fieldpath == 'Expected_PNL__c') {
                    fieldsetList[i]['value'] = contractRecord['Expected_PNL__c'];
                } else if (fieldsetList[i].fieldpath == 'CurrencyIsoCode') {
                    fieldsetList[i]['value'] = contractRecord['CurrencyIsoCode'];
                } else if (fieldsetList[i].fieldpath == 'Line_of_Business__c') {
                    fieldsetList[i]['value'] = contractRecord['Line_of_Business__c'];
                } else if (fieldsetList[i].fieldpath == 'Optimisation_Profile__c') {
                    fieldsetList[i]['value'] = contractRecord['Optimisation_Profile__c'];
                } else if (fieldsetList[i].fieldpath == 'Calorific_Value__c') {
                    fieldsetList[i]['value'] = contractRecord['Calorific_Value__c'];
                } else if (fieldsetList[i].fieldpath == 'Name') {
                    fieldsetList[i]['value'] = contractRecord['Name'];
                } else if (fieldsetList[i].fieldpath == 'Status__c') {
                    fieldsetList[i]['value'] = 'Approved';
                } else if (fieldsetList[i].fieldpath == 'New_Existing_Business__c') {
                    fieldsetList[i]['value'] = contractRecord['New_Existing_Business__c'];
                }
                
            }
            component.set("v.fieldsetList", fieldsetList);
        });
    }
})