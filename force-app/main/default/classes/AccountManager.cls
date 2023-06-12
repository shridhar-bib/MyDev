@RestResource(urlMapping='/Accounts/*/contacts')
global with sharing class AccountManager {
    @HttpGet
    global static Account getAccount() {
        RestRequest request = RestContext.request;
        // grab the caseId from the end of the URL
        String substring = request.requestURI.substringBeforeLast('/');
        String accId = substring.substring(
          substring.lastIndexOf('/')+1);
        Account result =  [SELECT Name, id, (Select Name, id from Contacts) FROM Account WHERE Id = :accId];
        return result;
    }    
}