@isTest
private class AnimalLocatorTest {
    @isTest static  void testGetCallout() {
        // Create the mock response based on a static resource
        AnimalLocatorMock mock = new AnimalLocatorMock();       
        Test.setMock(HttpCalloutMock.class, mock);
        // Call method to test
        String result = AnimalLocator.getAnimalNameById(1);
        system.debug('==result==='+result);
        // Verify mock response is not null
        System.assertEquals('chicken',result,
                               'The callout returned a null response.');
        
       
    }   
    
}