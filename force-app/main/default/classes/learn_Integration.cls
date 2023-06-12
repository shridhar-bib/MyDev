@restResource(urlMapping = '/learning/accountFetch/*')
global class learn_Integration {

    @httpGet
    global static Account fetchAcc(){
        RestRequest req = RestContext.request;
        String accId = req.requestURI.subString(req.requestURI.lastIndexOf('/')+1);
        
        Account acc = [SELECT Id, Name FROM Account WHERE id =: accId];
        return acc;
    }
    @httpPost
    global static Account fetchAccPost(String name){
        RestRequest req = RestContext.request;
        String accId = req.requestURI.subString(req.requestURI.lastIndexOf('/')+1);
        
        String body = String.valueOf(req.requestBody);
        system.debug('===='+req);
        Map<String,String> bodyMap = (Map<String,String>)Json.deserialize(JSON.serialize(req.requestBody), Map<String,String>.class);
        
        Account acc = [SELECT Id, Name FROM Account WHERE id =: accId];
        return acc;
    }
}