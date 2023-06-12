@isTest
global class AnimalsHttpCalloutMock implements HttpCalloutMock {
    // Implement this interface method
    global HTTPResponse respond(HTTPRequest request) {
        // Create a fake response
        String body = request.getBody();
       	Map<String, Object> jsonBody = (Map<String, Object>)JSON.deserializeUntyped(body);
        String name = String.valueof(jsonBody.get('name')); 
        HttpResponse response = new HttpResponse();
        response.setHeader('Content-Type', 'application/json');
        response.setBody('{"animals": ["majestic badger", "fluffy bunny", "scary bear", "chicken", "'+name+'"]}');
        response.setStatusCode(200);
        return response; 
    }
}