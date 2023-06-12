({
    // Sets an empApi error handler on component initialization
    onInit : function(component, event, helper) {
        component.set('v.userId', $A.get("$SObjectType.CurrentUser.Id"));
        // Get the empApi component
       // const empApi = component.find('empApi');

        // Uncomment below line to enable debug logging (optional)
        // empApi.setDebugFlag(true);

        // Register error listener and pass in the error handler function
       // empApi.onError($A.getCallback(error => {
            // Error can be any type of error (subscribe, unsubscribe...)
        //    console.error('EMP API error: ', error);
       // }));
       // 
       helper.subscribeHelper(component, event, helper);
        
    },

    // Invokes the subscribe method on the empApi component
    subscribe : function(component, event, helper) {
       // helper.subscribeHelper(component, event, helper);
        
    },
	unsubscribe : function(component, event, helper) {
      //  helper.unsubscribeHelper(component, event, helper);
        
    },    
    test : function(component, event, helper) {
    component.destroy();            
        window.history.back();
    }
})