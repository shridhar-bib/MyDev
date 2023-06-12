public class ParkLocator {
    
    public static List<String> country(){
        ParkService.ParksImplPort pp = new ParkService.ParksImplPort();
        List<String>  countryList = pp.byCountry('India');
        return countryList;
    }
}