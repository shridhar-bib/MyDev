({
	helperMethod : function() {
		
	},
    
    fetchStorageOperatorPicklist : function(component){
        var action = component.get("c.getPicklistvalues");
        action.setParams({
            'objectName': component.get("v.ObjectName"),
            'field_apiname': component.get("v.StorageOperator"),
            'nullRequired': true // includes --None--
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS"){
                component.set("v.StorageOperatorPicklist", a.getReturnValue()); 
            } 
        });
        $A.enqueueAction(action);
    },
    
    
})