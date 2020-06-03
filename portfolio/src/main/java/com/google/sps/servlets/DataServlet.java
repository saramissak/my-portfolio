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

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json;");

    Query query = new Query("Messages").addSort("timestamp", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    String numResultsString = request.getParameter("num-results");
    int numResults = 1;
    if (numResultsString != null) {
        numResults = Integer.parseInt(numResultsString);
    } 

    for (Entity entity : results.asIterable()) {
        numResults--;
        response.getWriter().println("<div id=\"" + KeyFactory.keyToString(entity.getKey()) +"\"><br><h5>" + entity.getProperty("fname"));
        response.getWriter().println(" " + entity.getProperty("lname") + "</h5>");
        response.getWriter().println(entity.getProperty("message"));
        response.getWriter().println("<input type='submit' value='Delete Comment' onclick='deleteComment(\""+ KeyFactory.keyToString(entity.getKey()) +"\")'></div>");
        if (numResults <= 0) break;
    }
  }
  
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String text = getParameter(request, "comment", "");
    String fname = getParameter(request, "fname", "");
    String lname = getParameter(request, "lname", "");

    long timestamp = System.currentTimeMillis();

    Entity taskEntity = new Entity("Messages");
    taskEntity.setProperty("message", text);
    taskEntity.setProperty("fname", fname);
    taskEntity.setProperty("lname", lname);
    taskEntity.setProperty("timestamp", timestamp);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(taskEntity);

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
