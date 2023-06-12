public class AnimalLocator {
    public static String getAnimalNameById(Integer index) {
        Http http = new Http();
        Map<String, Object> animal;
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://th-apex-http-callout.herokuapp.com/animals/'+index);
        request.setMethod('GET');        
        HttpResponse response = http.send(request);
        // Parse the JSON response
        if (response.getStatusCode() == 200) {
            Map<String, Object> responseBody =(Map<String, Object>)JSON.deserializeUntyped(response.getBody());
              animal = (Map<String, Object>) responseBody.get('animal');
            System.debug('Received the following animals:');
           
        } else {
            System.debug(response.getBody());
        }
        return String.valueof(animal.get('name'));
        
    }        
}