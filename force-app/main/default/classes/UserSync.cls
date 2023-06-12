/*
 	Name:SLMT_EndureUserSync
 
 	Description: Rest based webservice for Endure usre sync
	Author:Shridhar M
 	Version		Author 			Date		Detail
  	1.0			Shridhar M		08-09-2020	Initial Developement
*/


@RestResource(urlMapping='/user/*')
global with sharing class UserSync {

    @HttpPost
    global Static void postMethod(){
        RestRequest userRequestBody = RestContext.request;
        System.debug('InputJSON==>'+userRequestBody.requestBody);
        String userRequestBodyString = userRequestBody.requestBody.toString();
        List<User> userListToUpdate = new List<User>();
        // Deserialize to User request json
        UserRequestWrapper userRequestWrapper = (UserRequestWrapper)JSON.deserialize(userRequestBodyString, UserRequestWrapper.class);
        System.debug('userRequestWrapper==>'+userRequestWrapper);
        
        if(userRequestWrapper!= null && userRequestWrapper.records != null && userRequestWrapper.records.size() > 0 ){
            
            List<ResponseWrapper> responseWrapList = new List<ResponseWrapper>();
            List<String> userNameList = new List<String>();
            Map<String, Boolean> userExistMap = new Map<String, Boolean>();

            for(User user : userRequestWrapper.records){
                userNameList.add(user.email+'.shell');
            }

            List<User> userList = [SELECT username FROM User WHERE id in : userNameList];
            for(User user: userList){
                userExistMap.put(user.username, true);
            }

            for(User user : userRequestWrapper.records){
                if(!userExistMap.containsKey(user.Email+'.shell')){
                    user.ProfileID = '00e0o000002xtC3';
                    user.UserRoleId = '00E0o000001wFMz';
                    user.isactive = false;
                    user.LocaleSidKey = 'en_US';
                    user.TimeZoneSidKey = 'GMT';
                    user.LanguageLocaleKey = 'en_US';
                    user.EmailEncodingKey = 'UTF-8';
                    // user.CurrencyIsoCode = 'EUR - Euro';

                    user.Alias = user.firstname.mid(0,1)+''+user.lastname.mid(0,4);
                    user.Username = user.Email+'.shell';
                }
            }
           
            Schema.SObjectField externalId = User.Fields.Username;
            Database.UpsertResult[] saveResultList = Database.upsert(userRequestWrapper.records, externalId,userRequestWrapper.allOrNone);
            for (Integer i = 0 ; i < saveResultList.size() ; i++) {
                Database.UpsertResult sr = saveResultList.get(i);
                ResponseWrapper response = new ResponseWrapper();
                if (sr.isSuccess()) {
                    response.Id = sr.getId();
                    response.success = true;
                    response.error = '[]';
                    RestContext.response.statusCode = 200;
                } else {
                    response.Id = 'NOT_FOUND';
                    response.success = false;   
                    
                    for(Database.Error objErr : sr.getErrors()) {
                        response.error = objErr.getMessage();
                        System.debug(objErr.getStatusCode() + ': ' + objErr.getMessage());
                        System.debug('Oject fields which are affected by the error:'+ objErr.getFields());
                    }
                }
                responseWrapList.add(response);
            }
            
            if(! responseWrapList.isEmpty()){
                // RestContext.response.responseBody = Blob.valueOf(JSON.serialize(responseWrapList));
                RestContext.response.responseBody = Blob.valueOf('Test');
            }                
        }else{
            RestContext.response.statusCode = 400;
            RestContext.response.responseBody = Blob.valueOf('Bad Request');
        }
    }

    //standard salesforce error response structure
    public class ResponseWrapper {
        public String 	Id{get;set;}
        public Boolean 	success{get;set;}
        public String 	error{get;set;}
        
    }

    public class UserRequestWrapper {
        public Boolean 	allOrNone{get;set;}
        public List<User> records{get;set;}
    }
}