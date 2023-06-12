({
    callApexController: function (component, method, params, isBackground) {
        var action = component.get('c.' + method);
        if (params) {
            action.setParams(params);
        }
        // Batching of Actions
        // Multiple queued foreground actions are batched in a single request (XHR) to minimize network traffic.
        // The batching of actions is also known as boxcar’ing, similar to a train that couples boxcars together.
        // Foreground actions are the default. An action can be marked as a background action i.e by setting the isBackground flag to true
        if (isBackground != undefined && isBackground != null && isBackground != '' && isBackground) {
            action.setBackground(isBackground);
        }
        return new Promise($A.getCallback(function (resolve, reject) {
            action.setCallback(this, function (response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var retVal = response.getReturnValue();

                    // if (retVal.status) {
                    if (retVal != undefined) {
                        resolve(retVal);
                    } else {
                        reject(retVal);
                    }
                } else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) { // To show other type of exceptions
                            reject("Error message: " + errors[0].message);
                        }
                        if (errors[0] && errors[0].pageErrors) { // To show DML exceptions
                            reject("Error message: " + errors[0].pageErrors[0].message);
                        }
                    } else {
                        reject("Unknown error");
                    }
                }
            });
            $A.enqueueAction(action);
        }));
    },

    
    getUrlParams: function (url) {
        var urlSplitValue = url.split('?');
        var urlParamObject = {};
        if (urlSplitValue.length == 2) {
            var allParams = urlSplitValue[1].split('&');
            if (allParams.length > 0) {
                for (var i = 0; i < allParams.length; i++) {
                    var parameterkeyValueArray = allParams[i].split('=');
                    if (parameterkeyValueArray.length == 2) {
                        urlParamObject[parameterkeyValueArray[0]] = parameterkeyValueArray[1];
                    }
                }
            }
        }
        return urlParamObject;
    },
    getDataTableColDataFromFieldset: function (component, event, objectName, fieldSetName, alignmentParam) {
        var WrapperObj = {};
        var self = this;
        var fields = [];
        var fieldsWithAccess = [];
        if (alignmentParam == undefined || alignmentParam == null || alignmentParam == "") {
            alignmentParam = 'center';
        }
        var supportedDatatypes = ["currency", "date", "email", "location", "number", "percent", "phone", "text", "url"];
        return self.callApexController(component, "fetchFieldSetDetailsForTable", {
            objectName: objectName,
            fieldSetName: fieldSetName
        }).then(function (response) {
            var fields = JSON.parse(response.data);
            for (var i = 0; i < fields.length; i++) {
                var ColData = [];
                ColData["label"] = fields[i]["label"];
                ColData["sortable"] = true;
                ColData["fieldName"] = fields[i]["fieldpath"]
                if (supportedDatatypes.indexOf(fields[i]["type"].toLowerCase()) == 1) {
                    if (fields[i]["type"].toLowerCase() === 'date') {
                        var timezone = $A.get("$Locale.timezone");
                        ColData["typeAttributes"] = {
                            "timeZone": timezone
                        };
                    }
                    ColData["type"] = fields[i]["type"].toLowerCase();
                } else if (fields[i]["type"].toLowerCase() === 'double' || fields[i]["type"].toLowerCase() === 'integer') {
                    var labelString = fields[i]['label'].toLowerCase();
                    if (labelString.includes('amount') || labelString.includes('cost')) {
                        ColData["type"] = 'currency';
                        ColData["typeAttributes"] = {
                            "currencyDisplayAs": "symbol",
                            "currencyCode": 'USD',
                            "minimumFractionDigits": '2',
                            "maximumFractionDigits": '2'
                        }
                    } else {
                        ColData["type"] = 'number';
                    }
                } else if (fields[i]["type"].toLowerCase() === 'boolean') {
                    ColData["type"] = 'boolean';
                } else if (fields[i]["type"].toLowerCase() === 'datetime') {
                    ColData["type"] = 'date';
                    var timezone = $A.get("$Locale.timezone");
                    ColData["typeAttributes"] = {
                        "timeZone": timezone
                    };
                } else if (fields[i]["type"].toLowerCase() === 'currency') {
                    ColData["type"] = 'currency';
                    ColData["typeAttributes"] = {
                        "currencyDisplayAs": "symbol",
                        "currencyCode": 'USD',
                        "minimumFractionDigits": '2',
                        "maximumFractionDigits": '2'
                    }
                } else {
                    ColData["type"] = 'text';
                }
                if (fields[i]["label"] === 'Title') {
                    var ColDatatypeAttributes = [];
                    var ColDatatypeAttributesInnerArray = [];
                    ColData["fieldpath"] = fields[i]["fieldpath"] + '_url';
                    ColData["type"] = 'url';
                    ColDatatypeAttributesInnerArray["fieldName"] = fields[i]["fieldpath"];
                    ColDatatypeAttributes["label"] = ColDatatypeAttributesInnerArray;
                    ColData["typeAttributes"] = ColDatatypeAttributes;
                }
                var colDatacellAttributes = [];
                colDatacellAttributes["alignment"] = alignmentParam;
                ColData['cellAttributes'] = colDatacellAttributes;
                fieldsWithAccess.push(ColData);
            }
            WrapperObj.data = fieldsWithAccess;
            WrapperObj.status = true;
            WrapperObj.errormessage = '';
            return WrapperObj;
        }).catch(function (error) {
            return new Promise(function (resolve, reject) {
                reject(error);
            });
        });
    },
    getFieldValue: function resolve(path, obj) {
        return path.split('.').reduce(function (prev, curr) {
            return prev ? prev[curr] : null
        }, obj || self)
    },

    /* Description : Helper method to hide Spinner - <component> in Lightning components */
    hideSpinner: function (component, event, spinnerComponentId) {
        var spinner = component.find(spinnerComponentId);
        $A.util.addClass(spinner, 'slds-hide');
        window.setTimeout(
            $A.getCallback(function () {
                $A.util.removeClass(spinner, 'slds-show');
            }), 0
        );
    },

    /* Description : Helper method to Show Spinner - <component> in Lightning components */
    showSpinner: function (component, event, spinnerComponentId) {
        var spinner = component.find(spinnerComponentId);
        $A.util.addClass(spinner, 'slds-show');

        window.setTimeout(
            $A.getCallback(function () {
                $A.util.removeClass(spinner, 'slds-hide');
            }), 0
        );
    },

    // showToast: function (component, event, params) {
    //     var toastEvent = $A.get("e.force:showToast");
    //     toastEvent.setParams(params);
    //     toastEvent.fire();
    // },

    showSuccessToast: function (component, event, titleparam, messageparam) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            mode: 'dismissible',
            duration: '5000',
            title: titleparam,
            message: messageparam,
            type: 'success'
        });
        toastEvent.fire();
    },

    showInfoToast: function (component, event, titleparam, messageparam) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            mode: 'pester',
            duration: '5000',
            title: titleparam,
            message: messageparam,
            type: 'info'
        });
        toastEvent.fire();
    },

    showWarningToast: function (component, event, titleparam, messageparam) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            mode: 'dismissible',
            duration: '10000',
            title: titleparam,
            message: messageparam,
            type: 'warning'
        });
        toastEvent.fire();
    },

    showErrorToast: function (component, event, titleparam, messageparam) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            mode: 'dismissible',
            duration: '10000',
            title: titleparam,
            message: messageparam,
            type: 'error'
        });
        toastEvent.fire();
    },
    // to use custom toat shoud add <div aura:id="customToast"></div> in your compoent
    showToast: function (component, event, titleparam, messageparam, type) {
        var toastEvent = $A.get("e.force:showToast");
        switch (type.toLowerCase()) {
            case 'success':
                this.showSuccessToast(component, event, titleparam, messageparam);
                break;
            case 'error':
                this.showErrorToast(component, event, titleparam, messageparam);
                break;
            case 'warning':
                this.showWarningToast(component, event, titleparam, messageparam);
                break;
            case 'info':
                this.showInfoToast(component, event, titleparam, messageparam);
                break;
            default:
                return;
        }
    }

})