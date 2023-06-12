public class amartest {
    public static void testcall(){
            
		HTTPRequest req = new HTTPRequest();
      
           req.setEndpoint('https://tavanttrailtracker-developer-edition.na112.force.com/services/apexrest/getRating//3333a');
           req.setMethod('GET');
       
        HTTP http = new HTTP();
           HTTPResponse res = http.send(req);
        System.debug('res:::'+res);
      
       
        

    }
}