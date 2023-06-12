trigger withsharingcheck on Account (After update) {
    withsharingcheckHelper.udpateAcc(Trigger.New[0]);
}