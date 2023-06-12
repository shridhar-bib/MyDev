public class FileUploadController {
    @AuraEnabled
    public static List<ContentDocumentLink> getContentDocs(String recordId){
       List<ContentDocumentLink> contList = [SELECT ContentDocumentid, ContentDocument.Title FROM ContentDocumentLink WHERE LinkedEntityId =: recordId];
        return contList;
    }
}