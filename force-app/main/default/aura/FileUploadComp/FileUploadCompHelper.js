({
    doInitHelper : function(component, event, helper) {
        component.set('v.loadAttachmentTable', Date.now());
        var action = component.get("c.getContentDocs");
        action.setParams({
            recordId : "0010o00002cLxky"
        });
        
        action.setCallback(this, function(response){
            var contIdlist = [];
            var state = response.getState();
            if(state === "SUCCESS"){
                var retVal = response.getReturnValue();              
                
                var aData = [];
                if (retVal != undefined) {
                    let dataObj = {};
                    for (var i = 0; i < retVal.length; i++) {
                        dataObj = {};                        
                        dataObj['Title'] = retVal[i]["ContentDocument"]["Title"];                        
                        dataObj['Id'] = retVal[i]["ContentDocumentId"];  
                        aData.push(dataObj);
                        
                        contIdlist.push(retVal[i].ContentDocumentId);
                    }
                }
                
                var columns = [];
                
                columns.push({
                    label: 'Title',
                    fieldName: 'Title',
                    type: 'Text'                     
                });
                columns.push({label: '', type: 'button', initialWidth: 0, typeAttributes: { label: 'Preview', name: 'view_details'}});
                             
                component.set("v.columns", columns);
                component.set('v.dataList', aData);
                  component.set("v.contIdlist", contIdlist);
                //component.set('v.loadAttachmentTable', Date.now());
                
            }
        });
        
        $A.enqueueAction(action);
        
    },
     handleClick1: function(cmp, event, helper, selectedId) {
        var pageReference = {
            type: "standard__app",
            attributes: {
                appTarget: "standard__LightningSales",
                pageRef: {
                    type: "standard__recordPage",
                    attributes: {
                        recordId: "0690o00000HEMQdAAP",
                        objectApiName: "ContentDocument ",
                        actionName: "view"
                    }
                }
            }
        }
        
        
        var contIdlist =  cmp.get("v.contIdlist");
        var contIdStr = contIdlist.join(",");
        pageReference =  {    
            "type": "standard__namedPage",
            "attributes": {
                "pageName": "filePreview"                
            },
            state : {
                recordIds: contIdStr,
                selectedRecordId:selectedId
            }
        }
        var navService = cmp.find("navService");
        // Uses the pageReference definition in the init handler
        //var pageReference = cmp.get("v.pageReference");
        event.preventDefault();
        navService.navigate(pageReference);
    },
})