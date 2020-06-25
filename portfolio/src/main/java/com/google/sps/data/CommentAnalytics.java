package com.google.sps.data;
import java.util.HashMap;
import java.util.Map;

public class CommentAnalytics {
    public Map<String, Long> accountIdToCommentCountMap;
    public int totalNumOfComments;

    public CommentAnalytics(Map<String, Long> accountIdToCommentCountMap, int totalNumOfComments) {
        this.totalNumOfComments = totalNumOfComments;
        this.accountIdToCommentCountMap = accountIdToCommentCountMap;
    }
}
