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

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import java.util.ArrayList;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  private ArrayList<String> messages = new ArrayList<String>();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("text/html;");
    response.setContentType("application/json;");
    
    // response.getWriter().println(messages);
    for (int i = 0; i < messages.size(); i++)
    {
      response.getWriter().println(messages.get(i));
    }
  }

  private String convertToJson(String fname, String lname, String message) {
    String json = "{";
    json += "\"fname\": " + "\"" +fname + "\", ";
    json += "\"lname\": " + "\""  + lname + "\", ";
    json += "\"message\": " + "\"" + message + "\"" ;
    json += "}";
    return json;
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String text = getParameter(request, "comment", "");
    String fname = getParameter(request, "fname", "");
    String lname = getParameter(request, "lname", "");

    // messages.add(convertToJson(fname, lname, text));

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
