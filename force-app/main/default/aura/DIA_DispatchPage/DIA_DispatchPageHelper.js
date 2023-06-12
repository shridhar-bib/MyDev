({
    opportunityId: '',
    doInit: function (component, event, helper) {
        var self = helper;
        var urlParameters = helper.getUrlParams(window.location.href);
        var recordId = urlParameters["c__recordId"];
        var sObjectName = urlParameters["c__sObjectName"];

        self.queryRecords(component, event, helper, sObjectName, recordId);
    },

    queryRecords: function (component, event, helper,  sObjectName, recordId) {
        var self = helper;
        var queryString;
        if (sObjectName == 'Opportunity') {
            self.opportunityId = recordId;
            queryString = 'SELECT Volume_m3__c,New_Existing_Business__c,Name,Unit_of_Measure__c,Volume_MWh__c,Buy_Sell__c,Net_Intrinsic_Value__c,CurrencyIsoCode,Line_of_Business__c,Optimisation_Profile__c,Calorific_Value_Override__c,AccountId,Contract_End__c,Contract_Start__c FROM Opportunity WHERE Id =\'' + recordId + '\' ORDER BY CreatedDate DESC NULLS LAST';
        } else if (sObjectName == 'Dispatch_Instruction__c') {
            queryString = 'SELECT Opportunity__r.Name, Name, Status__c,Contract__c,Contract__r.Units__c,Contract__r.Start_date__c,Contract__r.End_date__c,Contract__r.CurrencyIsoCode, Contract__r.Counter_Party__c,Contract__r.Internal_Company__c,Contract__r.Storage_Capacity_Type_Held__c,Contract__r.Extra_Storage_Capacity_Bookings__c,Id FROM Dispatch_Instruction__c WHERE Id =\'' + recordId + '\'';
        } else {
            self.initializeDipatchObject(component, event, helper);
        }

        self.callApexController(component, "querySObjects", {
            queryString: queryString
        }).then(function (responseRecord) {
            self.initializeDipatchObject(component, event, helper, responseRecord, sObjectName);
        }).catch(function (error) {
            console.log(error.errormessage);
        });
    },
    
    initializeDipatchObject: function (component, event, helper, responseRecord, sObjectName) {

        var dispatchObject = {
            Id: "",
            Name: "",
            Contract__c: "",
            ContractRecord: {},
            Working_Gas_Unit__c: "",
            Working_Gas_Volume__c: "",
            capacityType: "Firm",//to dispable the interuptable fields in storage component
            ExtraStorageCapacityBookings: "No",//to dispable the Additional Capacity Booking Details fields in storage component
            ContractCurrency: "EUR"
        };

        if (sObjectName == 'Opportunity') {
            var contractRecord = {};
            if (responseRecord != undefined && responseRecord.length > 0) {
                contractRecord["Counter_Party__c"] = responseRecord[0].AccountId;
                contractRecord["Start_date__c"] = responseRecord[0].Contract_Start__c;
                contractRecord["End_date__c"] = responseRecord[0].Contract_End__c;
                contractRecord["Units__c"] = responseRecord[0].Unit_of_Measure__c;
                if (responseRecord[0].Volume_MWh__c != undefined && responseRecord[0].Volume_MWh__c > 0) {
                    contractRecord["Volume__c"] = responseRecord[0].Volume_MWh__c;
                } else {
                    contractRecord["Volume__c"] = responseRecord[0].Volume_m3__c || 0;//if both fields are undefined then assign 0
                }
                contractRecord["Buy_Sell__c"] = responseRecord[0].Buy_Sell__c;
                contractRecord["Expected_PNL__c"] = responseRecord[0].Net_Intrinsic_Value__c;
                contractRecord["CurrencyIsoCode"] = responseRecord[0].CurrencyIsoCode;
                contractRecord["Line_of_Business__c"] = responseRecord[0].Line_of_Business__c;
                contractRecord["Optimisation_Profile__c"] = responseRecord[0].Optimisation_Profile__c;
                contractRecord["Calorific_Value__c"] = responseRecord[0].Calorific_Value_Override__c;
                contractRecord["Name"] = responseRecord[0].Name;
                contractRecord["New_Existing_Business__c"] = responseRecord[0].New_Existing_Business__c;
            }
            dispatchObject["ContractRecord"] = contractRecord;
            dispatchObject["WorkingGasVolume"] = contractRecord["Volume__c"];
            dispatchObject["WorkingGasUnit"] = contractRecord["Units__c"];
            dispatchObject["StartDate"] = contractRecord["Start_date__c"];
            dispatchObject["EndDate"] = contractRecord["End_date__c"];
            dispatchObject["ContractCurrency"] = contractRecord["CurrencyIsoCode"];

        } else if (sObjectName == 'Dispatch_Instruction__c') {
            if (responseRecord != undefined && responseRecord.length > 0) {
                dispatchObject["Id"] = responseRecord[0].Id;
                dispatchObject["Contract__c"] = responseRecord[0].Contract__c;
                dispatchObject["ContractRecord"] = responseRecord[0].Contract__r;
                dispatchObject["capacityType"] = dispatchObject["ContractRecord"]["Storage_Capacity_Type_Held__c"];//to enable/dispable the interuptable fields in storage component
                dispatchObject["ExtraStorageCapacityBookings"] = dispatchObject["ContractRecord"]["Extra_Storage_Capacity_Bookings__c"];//to enable/dispable the interuptable fields in storage component
                dispatchObject["Name"] = responseRecord[0]["Name"];
                dispatchObject["Status__c"] = responseRecord[0]["Status__c"];
                dispatchObject["OpportunityName"] = responseRecord[0]["Opportunity__r.Name"];
                dispatchObject["WorkingGasUnit"] = dispatchObject["ContractRecord"]["Units__c"];
                dispatchObject["StartDate"] = dispatchObject["ContractRecord"]["Start_date__c"];
                dispatchObject["EndDate"] = dispatchObject["ContractRecord"]["End_date__c"];
                dispatchObject["ContractCurrency"] = dispatchObject["ContractRecord"]["CurrencyIsoCode"];
            }
        }
        component.set("v.dispatchRecord", dispatchObject);

    },

    saveDispatchHelper: function (component, event, helper) {
        var dispatchRecord = component.get("v.dispatchRecord");
        var dispacthObjectToSave = {};

        helper.showSpinner(component, event, 'dispatchPageSpinner');

        //preapre dispatch record for save
        dispacthObjectToSave["sobjectType"] = "Dispatch_Instruction__c";
        // dispacthObjectToSave["Name"] = "";
        if (dispatchRecord["Id"] == undefined || dispatchRecord["Id"] == '') {
            dispacthObjectToSave["Status__c"] = "In Progress";
            dispacthObjectToSave["Opportunity__c"] = helper.opportunityId;

            if (dispatchRecord["contractRecordId"] || dispatchRecord["contractRecordId"]) {
                dispacthObjectToSave["Contract__c"] = dispatchRecord["contractRecordId"];
            } else {
                helper.showToast(component, event, 'Error', 'Contrat should be created first in order to create Dispatch', 'error');
                helper.hideSpinner(component, event, 'dispatchPageSpinner');
                return;
            }
        } else {
            dispacthObjectToSave["Id"] = dispatchRecord["Id"];
            dispacthObjectToSave["Contract__c"] = dispatchRecord["contractRecordId"];
        }

        // fetch the dispatch fields values from child objects using bind variable v.dispatchRecord
        // fetch from storage component
        dispacthObjectToSave["Storage_Operator__c"] = dispatchRecord["StorageOperator"];
        dispacthObjectToSave["Facility_Name__c"] = dispatchRecord["FacilityName"];
        dispacthObjectToSave["Working_Gas_Volume__c"] = dispatchRecord["WorkingGasVolume"];
        dispacthObjectToSave["Additional_Gas_Volume__c"] = dispatchRecord["AdditionalGasVolume"];
        dispacthObjectToSave["Working_Gas_Unit__c"] = dispatchRecord["WorkingGasUnit"];
        dispacthObjectToSave["Injection_Rate__c"] = dispatchRecord["InjectionRate"];
        dispacthObjectToSave["Withdrawal_Rate__c"] = dispatchRecord["WithdrawalRate"];
        dispacthObjectToSave["Interruptible_Working_Gas_Volume__c"] = dispatchRecord["InterruptibleWorkingGasVolume"];
        dispacthObjectToSave["Interruptible_Injection_Rate__c"] = dispatchRecord["InterruptibleInjectionRate"];
        dispacthObjectToSave["Interruptible_Withdrawal_Rate__c"] = dispatchRecord["InterruptibleWithdrawalRate"];
        dispacthObjectToSave["Instruction_of_extra_storage__c"] = dispatchRecord["InstructionOfExtraStorage"];
        dispacthObjectToSave["Instruction_for_extra_transport_capacity__c"] = dispatchRecord["InstructionForExtraTransportCapacity"];
        dispacthObjectToSave["Storage_Maintenance__c"] = dispatchRecord["StorageMaintenance"];
        dispacthObjectToSave["Additional_Capacity_Instr_For_Day_Ahead__c"] = dispatchRecord["AdditionalCapacityInstrForDayAhead"];
        dispacthObjectToSave["Additional_Capacity_Instr_For_Within_Day__c"] = dispatchRecord["StorageAdditionalCapacityInstrForWithinDayMaintenance"];

        //fetch values from nomination/transporation component
        dispacthObjectToSave["Nomination_Lead_Time__c"] = dispatchRecord["NominationLeadTime"];
        dispacthObjectToSave["Mode_of_Nomination__c"] = dispatchRecord["ModeofNomination"];
        dispacthObjectToSave["Edigas_Details__c"] = dispatchRecord["EdigasDetails"];
        dispacthObjectToSave["Nomination_Web_portal__c"] = dispatchRecord["NominationWebPortal"];
        dispacthObjectToSave["Renomination__c"] = dispatchRecord["Renomination"];
        dispacthObjectToSave["Allocations__c"] = dispatchRecord["Allocations"];
        dispacthObjectToSave["Is_MultiMarket__c"] = dispatchRecord["IsMultiMarket"] || 'false';
        dispacthObjectToSave["Regent_Rules__c"] = dispatchRecord["RegentRules"];
        dispacthObjectToSave["Includes_Transportation__c"] = dispatchRecord["IncludesTransportation"] || 'false';
        dispacthObjectToSave["Transport_Injection_Rate__c"] = dispatchRecord["TransportInjectionRate"];
        dispacthObjectToSave["Transport_Withdrawal_Rate__c"] = dispatchRecord["TransportWithdrawalRate"];

        // fetch values from Declied Curves component
        dispacthObjectToSave["Decline__c"] = dispatchRecord["Decline"];

        // fetch values from Additonal Details component
        dispacthObjectToSave["Extra_documentation__c"] = dispatchRecord["ExtraDocumentation"];
        dispacthObjectToSave["Any_other_comments__c"] = dispatchRecord["AnyOtherComments"];

        helper.callApexController(component, "getRecTypeId", {
            'sObjectAPIName': "Dispatch_Instruction__c",
            'recordTypeLabel': "New DI"
        }).then(function (response) {
            if (response.status && response.data != undefined && (dispatchRecord["Id"] == undefined || dispatchRecord["Id"] == '')) {
                dispacthObjectToSave["RecordTypeId"] = response.data.substring(1, 16);
            }
            return helper.callApexController(component, "upsertSObjects", {
                'sObjectList': [dispacthObjectToSave],
                'allOrNone': false
            });
        }).then(function (saveResponse) {
            if (saveResponse.status && saveResponse.data != undefined) {
                var dispatchRecordList = JSON.parse(saveResponse.data);
                if (dispatchRecordList[0]["id"] != undefined || dispatchRecordList[0]["id"] != '') {
                    if (dispatchRecord["Id"] == undefined || dispatchRecord["Id"] == '') {
                        helper.showToast(component, event, 'Success', 'Dispatch Record Created Successfully', 'success');
                        helper.queryRecords(component, event, helper, 'Dispatch_Instruction__c', dispatchRecordList[0]["id"]);
                    } else {
                        helper.showToast(component, event, 'Success', 'Dispatch Record Updated Successfully', 'success');
                    }
                    //dispatchRecord["Id"] = dispatchRecordList[0]["id"];
                    //component.set("v.dispatchRecord", dispatchRecord);
                } else {
                    helper.showToast(component, event, 'Error', error, 'error');
                }

            } else {
                helper.showToast(component, event, 'Error', error.errormessage, 'error');
            }
            helper.hideSpinner(component, event, 'dispatchPageSpinner');
        }).catch(function (error) {
            helper.hideSpinner(component, event, 'dispatchPageSpinner');
            helper.showToast(component, event, 'Error', error, 'error');
            console.log(error);
        });

    },

    //This action will call apex method and sumbits the dispatch for apporoval
    submitForApprovalHelper: function (component, event, helper) {
        helper.showSpinner(component, event, 'dispatchPageSpinner');

        var dispatchRecord = component.get("v.dispatchRecord");
        if (dispatchRecord["Id"] == undefined || dispatchRecord["Id"] == '') {
            helper.showToast(component, event, 'Info', 'Please create Dispatch then submit it for approval', 'info');
            setTimeout(() => {
                helper.hideSpinner(component, event, 'dispatchPageSpinner');
            }, 1000);
            
        } else {
            helper.callApexController(component, "submitDispatchForApproval", {
                dispatchId: dispatchRecord["Id"]
            }).then(function (response) {
                if (response.status) {
                    helper.showToast(component, event, 'Success', 'Dispatch is submitted for approval and mail is sent to respective team', 'success');
                    var domainUrl = window.location.origin;
                    setTimeout(() => {
                        window.open(domainUrl + '/lightning/r/Dispatch_Instruction__c/' + dispatchRecord["Id"] + '/view', '_parent');
                    }, 1000);
                } else {
                    helper.showToast(component, event, 'Error', response.errormessage, 'error');
                }
                helper.hideSpinner(component, event, 'dispatchPageSpinner');
            }).catch(function (error) {
                helper.showToast(component, event, 'Error', error, 'error');
                helper.hideSpinner(component, event, 'dispatchPageSpinner');
            });
        }
    }


})