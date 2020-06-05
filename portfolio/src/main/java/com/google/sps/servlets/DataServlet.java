// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.sps.data.Comments;
import java.lang.String;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Key;
import java.text.DateFormat;  
import java.text.SimpleDateFormat;  
import java.util.Date;  
import java.util.Calendar;  

/** Servlet that returns some example content. */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  private int numOfResults;
  private ArrayList<Comments> messages = new ArrayList<Comments>();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");
    

    Query query = new Query("Messages").addSort("timestamp", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    messages = new ArrayList<Comments>();

    for (Entity entity : results.asIterable()) {
        Comments comment = new Comments();
        comment.fname =  (String) entity.getProperty("fname");
        comment.lname =  (String) entity.getProperty("lname");
        comment.message =  (String) entity.getProperty("message");
        comment.timeStamp =  (long) entity.getProperty("timestamp");
        comment.key = (String) KeyFactory.keyToString(entity.getKey());
        messages.add(comment);
    }
    String json = new Gson().toJson(messages);
    response.getWriter().println(json);
  }
  
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String text = getParameter(request, "comment", "");
    String fname = getParameter(request, "fname", "");
    String lname = getParameter(request, "lname", ""); 

    long time = System.currentTimeMillis();

    Entity taskEntity = new Entity("Messages");
    taskEntity.setProperty("message", text);
    taskEntity.setProperty("fname", fname);
    taskEntity.setProperty("lname", lname);
    taskEntity.setProperty("timestamp", time);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(taskEntity);
    
    Comments comment = new Comments();
    comment.fname =  (String) fname;
    comment.lname =  (String) lname;
    comment.message =  (String) text;
    comment.timeStamp = time;
    comment.key =  KeyFactory.keyToString(taskEntity.getKey());
    messages.add(comment);

    // Redirect back to the HTML page.
    response.sendRedirect("/index.html");
  }

  private String getParameter(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    if (value == null) {
      return defaultValue;
    }
    return value;
  }
}
