global class AreaWrapper1 implements Comparable{
    public String AreaName{get;set;}
    public String ADName{get;set;}

    public AreaWrapper1(){
        AreaName = '';
        ADName = '';
    }       

    public Integer compareTo(Object objToCompare) {
        //Sort by AreaName Alphabetically
        return AreaName.compareTo(((AreaWrapper1)objToCompare).AreaName);
    }
}