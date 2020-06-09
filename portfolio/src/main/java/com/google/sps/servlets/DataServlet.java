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

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.sps.data.Comment;
import com.google.sps.data.TotalComments;
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
import com.google.appengine.api.datastore.FetchOptions;


/** Servlet that returns some example content. */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  private ArrayList<Comment> comments = new ArrayList<Comment>();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");

    String numResultsString = request.getParameter("num-results");
    int numResults = 10;
    if (numResultsString != null) {
        numResults = Integer.parseInt(numResultsString);
    } 

    String pageString = request.getParameter("page");
    int page = 0;
    if (pageString != null) {
        page = Integer.parseInt(pageString);
    }
    
    int offset = page*numResults;

    Query query = new Query("Messages").addSort("timestamp", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);
    List<Entity> entities = results.asList(FetchOptions.Builder.withLimit(offset + numResults));

    if (entities.size() == 0 || 0 < offset+numResults && offset < entities.size())
    {
      comments = new ArrayList<Comment>();
    }
    for (int i = offset; i < offset+numResults && i < entities.size() && i >= 0; i++) {
      Comment comment = new Comment();
      comment.fname =  (String) entities.get(i).getProperty("fname");
      comment.lname =  (String) entities.get(i).getProperty("lname");
      comment.message =  (String) entities.get(i).getProperty("message");
      comment.timeStamp =  (long) entities.get(i).getProperty("timestamp");
      comment.email =  (String) entities.get(i).getProperty("email");
      comment.key = (String) KeyFactory.keyToString(entities.get(i).getKey());
      comments.add(comment);
    }
    
    TotalComments data = new TotalComments(comments, results.countEntities());

    String json = new Gson().toJson(data);
    response.getWriter().println(json);
  }
  
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    UserService userService = UserServiceFactory.getUserService();
    if (userService.isUserLoggedIn()) {
      String text = getParameter(request, "comment", "");
      String fname = getParameter(request, "fname", "");
      String lname = getParameter(request, "lname", ""); 

      long time = System.currentTimeMillis();

      String userEmail = userService.getCurrentUser().getEmail();

      Entity taskEntity = new Entity("Messages");
      taskEntity.setProperty("message", text);
      taskEntity.setProperty("fname", fname);
      taskEntity.setProperty("lname", lname);
      taskEntity.setProperty("timestamp", time);
      taskEntity.setProperty("email", userEmail);
      
      
      DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
      datastore.put(taskEntity);
    
      Comment comment = new Comment();
      comment.fname =  (String) fname;
      comment.lname =  (String) lname;
      comment.message =  (String) text;
      comment.timeStamp = time;
      comment.email = userEmail;
      comment.key =  KeyFactory.keyToString(taskEntity.getKey());
      comments.add(comment);
    }
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
