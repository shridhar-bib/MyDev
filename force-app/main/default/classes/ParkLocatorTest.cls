@isTest
public class ParkLocatorTest {
	
    @isTest static void testCallout() {              
       Test.setMock(WebServiceMock.class, new ParkServiceMock());
    	List<String> countryList = ParkLocator.country();			
        System.assertEquals(2, countryList.size()); 
    }
}