({
    doInit: function (cmp, event, helper) {
        helper.doInitHelper(cmp, event, helper);
    },
     handleUploadFinished: function (cmp, event) {
        // Get the list of uploaded files
        var uploadedFiles = event.getParam("files");
        alert("Files uploaded : " + uploadedFiles.length);
        
        // Get the file name
        uploadedFiles.forEach(file => console.log(file.name));
    },
    openFile: function (component, event) {
        var modalBody;
        $A.createComponent("c:ModalToOpenFiles", {
            
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
    },
    openSingleFile: function(cmp, event, helper) {
        $A.get('e.lightning:openFiles').fire({
            recordIds: ['0690o00000HEMQdAAP']
        });
    },
    handleClick: function(cmp, event, helper) {
        helper.doInitHelper(cmp, event, helper);
    },
    handleClick1: function(cmp, event, helper) {
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
                "pageName": "filePreview",
                "recordId": "0690o00000HEMQdAAP",
            },
            state : {
                recordIds: contIdStr,
                selectedRecordId:'0690o00000HEMQdAAP'
            }
        }
        var navService = cmp.find("navService");
        // Uses the pageReference definition in the init handler
        //var pageReference = cmp.get("v.pageReference");
        event.preventDefault();
        navService.navigate(pageReference);
    },
    handleRowAction: function (cmp, event, helper) {
         
        var action = event.getParam('action');
        var row = event.getParam('row');
        helper.handleClick1(cmp, event, helper, row["Id"] );
        
    }
    
    
})