/* Name: DIA_ResponseWrapper
Description : A generic Wrapper Class used in DIA utility component for return type
Author : (Shridhar M)
History :
VERSION      AUTHOR          		DATE                DETAIL                                    UserStory/Req#
1.0 -         Shridhar M           24/12/2020          INITIAL DEVELOPMENT
*/
public with sharing class DIA_ResponseWrapper {
	@AuraEnabled
	public String data;
	@AuraEnabled
	public Boolean status; // success-0/fail-1
	@AuraEnabled
	public String errormessage;

	public DIA_ResponseWrapper(){

	}

	public DIA_ResponseWrapper(String data, Boolean status, string errormessage) {
		this.data = data;
		this.status = status;
		this.errormessage = errormessage;
	}
}