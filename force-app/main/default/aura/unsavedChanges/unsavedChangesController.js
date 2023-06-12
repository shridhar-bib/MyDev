({
     makeUnsavedChanges: function(cmp, evt, helper) {
          alert('makeUnsavedChanges');
         var unsaved = cmp.find("unsaved");
         unsaved.setUnsavedChanges(true, { label: 'My component name' });
     },
     clearUnsavedChanges: function(cmp, evt, helper) {
          alert('clearUnsavedChanges');
         var unsaved = cmp.find("unsaved");
         unsaved.setUnsavedChanges(false);
     },
     handleSave: function(cmp, evt, helper) {
          alert('handleSave');
         //... my custom save logic
         // When the custom save logic has completed the setUnsavedChanges method
         // must be called again to return control to the lightning UI
         var unsaved = cmp.find("unsaved");
         if (true) {
           // return control to the lightning UI while indicating that the content is still unsaved, preventing it from being dismissed
           unsaved.setUnsavedChanges(true);
         }
         else {
           // return control to the lightning UI while indicating that the content is saved
           unsaved.setUnsavedChanges(false);
         }
     },
     handleDiscard: function(cmp, evt, helper) {
          alert('handleDiscard');
        // similar to the handleSave method, but for discarding changes
     },
     cancelHelper: function (component, event, helper) {
        var pageReference = {
            "type": "standard__recordPage",
            "attributes": {
                "recordId":'0030o00002fCoFfAAK',
                "objectApiName": "Contact",
                "actionName": "view"
            }
        }
        var navService = component.find("claimActionNavigate");
        navService.navigate(pageReference);
    }
})