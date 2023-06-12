global class TestCompareSortWrapper {
    public static List<AreaWrapper> getWrap(){
        List<AreaWrapper> awList = new List<AreaWrapper>();
        AreaWrapper aw1 = new AreaWrapper();
        aw1.ADName = 'Karnataka';
        aw1.AreaName  = 'Bangalore';
        awList.add(aw1);
        
        AreaWrapper aw2 = new AreaWrapper();
        aw2.ADName = 'Telangana';
        aw2.AreaName  = 'Anantpur';
        awList.add(aw2);
        
        AreaWrapper aw3 = new AreaWrapper();
        aw3.ADName = 'Delhi';
        aw3.AreaName  = 'Delhi';
        awList.add(aw3);
        
        AreaWrapper aw4 = new AreaWrapper();
        aw4.ADName = 'Karnataka';
        aw4.AreaName  = 'Vijapur';
        awList.add(aw4);
        AreaWrapper aw5 = new AreaWrapper();
        aw5.ADName = 'Karnataka';
        aw5.AreaName  = 'Hassan';
        awList.add(aw5);
        
        List<AreaWrapper> awList1 = new List<AreaWrapper>();
        awList.sort();
        return awList;
    }
    
    global class AreaWrapper implements Comparable{
        public String AreaName{get;set;}
        public String ADName{get;set;}
        
        public AreaWrapper(){
            AreaName = '';
            ADName = '';
        }       
        
        global Integer compareTo(Object objToCompare) {
            AreaWrapper that = (AreaWrapper) objToCompare;
            Integer c = this.ADName.compareTo(that.ADName);
            if (c != 0) {
                return c;
            } else {
                return this.AreaName.compareTo(that.AreaName);
            }
        }
    }
}