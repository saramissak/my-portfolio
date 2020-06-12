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

  public static Map<String, Long> nLargestCommenters(Map<String, Long> hashMap, int n) {
    Long value;
    List<String> strings = new ArrayList<>(n); 
    List<Long> counts = new ArrayList<>(n); 
    int index;

    // Allows you to loop through all of elements in the hashMap
    for (String key : hashMap.keySet()) { 
      value = hashMap.get(key); 
      index = strings.size() - 1; 
      while (index >= 0 && value > counts.get(index)) { 
        index--; 
      }
      index = index + 1; 
      counts.add(index, value); 
      strings.add(index, key); 
      if (counts.size() > n) {
        counts.remove(n); 
        strings.remove(n);
      }
    }
    
    Map<String, Long> result = new HashMap<>(counts.size());
    for (int i = 0; i < counts.size(); i++) { 
      result.put(strings.get(i), counts.get(i));
    }
    return result;
  }
}
