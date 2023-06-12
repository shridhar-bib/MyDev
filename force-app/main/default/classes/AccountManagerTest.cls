@IsTest
private class AccountManagerTest {
    @isTest static void testGetCaseById() {
         Id recordId = createTestRecord();
        // Set up a test request
        RestRequest request = new RestRequest();
        request.requestUri =
            '/services/apexrest/Accounts/'+recordId+'/contacts';
        request.httpMethod = 'GET';
        RestContext.request = request;
        // Call the method to test
        Account acc = AccountManager.getAccount();
        // Verify results
        System.assert(acc != null);
        System.assertEquals('Test record', acc.name);
    }        
     static Id createTestRecord() {
        // Create test record
        Account acc = new Account(
            Name='Test record');
        insert acc;
        return acc.Id;
    }   
}