({
    doinit : function(component, event, handler){
        var action = component.get("c.returnValue");

        action.setParams({
            value : 'test'
        });

        action.setCallback(this, function(response){
            if(response.status){
                var returnvalue = response.getReturnValue();
                component.set("v.showValue", returnvalue);
            }
        });

        $A.enqueueAction();
    }
})