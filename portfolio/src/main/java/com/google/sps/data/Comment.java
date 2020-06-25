package com.google.sps.data;

import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

public class Comment {
  public String fname;
  public String lname;
  public String message;
  public long timeStamp;
  public String email;
  public String key;

  public static Map<String, Long> nLargestCommenters(Map<String, Long> accountIdToCommentCountMap, int n) {
    Long commentCount;
    List<String> accountIds = new ArrayList<>(n); 
    List<Long> counts = new ArrayList<>(n); 
    int index;

    // Gets the top n comments
    for (String key : accountIdToCommentCountMap.keySet()) { 
      commentCount = accountIdToCommentCountMap.get(key); 
      index = accountIds.size() - 1; 
      while (index >= 0 && commentCount > counts.get(index)) { 
        index--; 
      }
      index = index + 1; 
      counts.add(index, commentCount); 
      accountIds.add(index, key); 
      if (counts.size() > n) {
        counts.remove(n); 
        accountIds.remove(n);
      }
    }
    
    Map<String, Long> result = new HashMap<>(counts.size());
    for (int i = 0; i < counts.size(); i++) { 
      result.put(accountIds.get(i), counts.get(i));
    }
    return result;
  }
}
