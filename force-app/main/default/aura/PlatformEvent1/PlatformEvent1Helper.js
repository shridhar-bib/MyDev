({
    // Invokes the subscribe method on the empApi component
    subscribeHelper: function (component, event, helper) {
        console.log('=plat=====A=subscribeHelper==entry');
        // Get the empApi component
        const empApi = component.find('empApi');
        // Get the channel from the input box
        const channel = component.find('channel').get('v.value');
        // Replay option to get new events
        const replayId = -1;
        var userId = component.get("v.userId");

        // Subscribe to an event
        empApi.subscribe(channel, replayId, $A.getCallback(eventReceived => {
            // Process event (this is called each time we receive an event)
            console.log('=plat===A==subscribeHelper=callback=entry');
           // console.log('Received event ', JSON.stringify(eventReceived));
            var eventReceivedObject = JSON.parse(JSON.stringify(eventReceived));
            var eventData = eventReceivedObject.data.payload;
            if (eventData.UserId__c != userId) {
                console.log('=plat===A=====diff user==');
               
            	helper.publishEventB(component, event, helper);
            } else {
                console.log('=plat===A=====same user==');
            }

        })).then(subscription => {
            // Confirm that we have subscribed to the event channel.
            // We haven't received an event yet.
            console.log('=plat===A==subscribeHelper=then=entry');
           // console.log('Subscribed to channel ', subscription.channel);
            // Save subscription to unsubscribe later
            component.set('v.subscription', subscription);
            helper.publishEvent(component, event, helper);
            helper.subscribeBlockHelper(component, event, helper);

            //alert();
        });
    },
    // Invokes the unsubscribe method on the empApi component
    unsubscribeHelper: function (component, event, helper) {
        console.log('=plat=====A=unsubscribeHelper==entry');
        // Get the empApi component
        const empApi = component.find('empApi');
        // Get the subscription that we saved when subscribing
        const subscription = component.get('v.subscription');

        // Unsubscribe from event
        empApi.unsubscribe(subscription, $A.getCallback(unsubscribed => {
            // Confirm that we have unsubscribed from the event channel
            console.log('=plat===A==unsubscribeHelper==callback===entry');


            component.set('v.subscription', null);


        })).then(unsubscribe => {
            console.log('=plat====A=unsubscribeHelper==then===entry');
        });
    },
    publishEvent: function (component, event, helper) {
        let action = component.get("c.publishPlatformEvent");
        action.setCallback(this, function (response) {
            console.log('=plat==A==publish==event===');
            var dd = response.getReturnValue();
        });
        $A.enqueueAction(action);

    },
    subscribeBlockHelper: function (component, event, helper) {
        console.log('=plat==B==subscribeHelper==entry');
        // Get the empApi component
        const empApi = component.find('empApi');
        // Get the channel from the input box
        const channel = '/event/Block__e';
        // Replay option to get new events
        const replayId = -1;
        var userId = component.get("v.userId");

        // Subscribe to an event
        empApi.subscribe(channel, replayId, $A.getCallback(eventReceived => {
            // Process event (this is called each time we receive an event)
            console.log('=plat===B==subscribeHelper=callback=entry');
           // console.log('Received event ', JSON.stringify(eventReceived));
            var eventReceivedObject = JSON.parse(JSON.stringify(eventReceived));
            var eventData = eventReceivedObject.data.payload;
            if (eventData.UserId__c != userId) {
                console.log('=plat===B=====diff user=='); 
            console.log('=plat===B===BLOCK IT=='); 
             helper.unsubscribeHelper(component, event, helper);
             helper.unsubscribeHelperB(component, event, helper);
            } else {
                console.log('=plat===B=====same user==');
            }

        })).then(subscription => {
            // Confirm that we have subscribed to the event channel.
            // We haven't received an event yet.
            console.log('=plat==B===subscribeHelper=then=entry');
            //console.log('Subscribed to channel ', subscription.channel);
            // Save subscription to unsubscribe later
            component.set('v.subscriptionB', subscription);            

            //alert();
        });
    },
     unsubscribeHelperB: function (component, event, helper) {
        console.log('=plat=====B=unsubscribeHelper==entry');
        // Get the empApi component
        const empApi = component.find('empApi');
        // Get the subscription that we saved when subscribing
        const subscription = component.get('v.subscriptionB');

        // Unsubscribe from event
        empApi.unsubscribe(subscription, $A.getCallback(unsubscribed => {
            // Confirm that we have unsubscribed from the event channel
            console.log('=plat===B==unsubscribeHelper==callback===entry');


            component.set('v.subscription', null);


        })).then(unsubscribe => {
            console.log('=plat====B=unsubscribeHelper==then===entry');
        });
    },
     publishEventB: function (component, event, helper) {
        let action = component.get("c.publishPlatformEventB");
        action.setCallback(this, function (response) {
            console.log('=plat==B==publish==event===');
            var dd = response.getReturnValue();
        });
        $A.enqueueAction(action);

    },
})