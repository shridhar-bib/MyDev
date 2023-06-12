public with sharing class TestPlatformEventinBatch implements Database.Batchable<SObject>, Database.RaisesPlatformEvents {


public Database.QueryLocator start(Database.BatchableContext ctx){
	return Database.getQueryLocator([SELECT Id,Name FROM Account Limit 10]);
}

public void execute(Database.BatchableContext ctx, List<Account> records){
	List<Contact> conList = new List<Contact>();
	for(Account acc:records) {
		Contact con = new Contact();
		con.AccountId = acc.Id;
		con.LastName = acc.Id;
		if(acc.Name =='Utah') {
			con.LastName  = null;
		}
		if(acc.Name == 'Idaho'){
			con.Secret_Key__c = 'test';
		}
		conList.add(con);
	}
	// insert conList;
	System.debug('=conList==='+conList);
	Database.SaveResult[] srList = Database.insert(conList, false);

// Iterate through each returned result
    String errorMessage;
	for (Database.SaveResult sr : srList) {
		if (sr.isSuccess()) {
			// Operation was successful, so get the ID of the record that was processed
			System.debug('Successfully inserted account. Account ID: ' + sr.getId());
		}
		else {
            errorMessage = sr.getId();
			String error ;// Operation failed, so get all errors
			System.debug('====sr.getErrors()========'+sr.getErrors());
			for(Database.Error err : sr.getErrors()) {
				System.debug('====getMessage()========'+err.getMessage());
				System.debug(err.getStatusCode() + ': ' + err.getMessage());
                error += ','+err.getMessage(); 
			}
            errorMessage +='-> '+error+'\n'; 
		}
	}

    if(errorMessage != null){
        throw new MyOrgException(errorMessage);
    }
}

public void finish(Database.BatchableContext ctx){

}
}