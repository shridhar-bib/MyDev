public class checkShareObjContr{

    public static void shareReco(List<Small_tower__c> smalltower){
        List<Small_tower__Share> smshareList = new List<Small_tower__Share>();
        for(Small_tower__c sm : smalltower){
            Small_tower__Share smshare = new Small_tower__Share();
            smshare.AccessLevel = 'Edit';
            smshare.ParentId = sm.id;
            smshare.UserOrGroupId  = '0050o00000Yzc1v';
            smshareList.add(smshare);
        }

        // insert smshareList;

    }
}