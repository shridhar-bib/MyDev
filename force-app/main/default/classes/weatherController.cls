public class weatherController {
    public Map<String, Object> results{get;set;}
    public weatherController(ApexPages.StandardController controller){
        getWeatherRepo();
    }
    
    public void getWeatherRepo(){
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('http://api.openweathermap.org/data/2.5/weather?q=Bangalore&units=metric&APPID=e0973247dbb5fa0fadc489e4bb56de08');
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        // If the request is successful, parse the JSON response.
        if (response.getStatusCode() == 200) {
            
             results = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            System.debug('Received the following animals:'+results);
            //List<Object> animals = (List<Object>) results.get('main');
            //System.debug('Received the following animals:'+);
            
        }
    }
    
    public class weatherResponse{
        Decimal temp;
        Decimal pressure;
        Decimal humidity;
        Decimal temp_min;
        Decimal temp_max;
    }
}