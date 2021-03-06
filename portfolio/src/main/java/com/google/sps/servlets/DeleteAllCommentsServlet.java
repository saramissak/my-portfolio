
package com.google.sps.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.sps.data.Comment;
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
import java.util.HashMap;
import java.util.Map;
import com.google.sps.data.CommentAnalytics;

@WebServlet("/delete-data")
public class DeleteAllCommentsServlet extends HttpServlet {

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query query = new Query("Messages").addSort("timestamp", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);
    UserService userService = UserServiceFactory.getUserService();
    String email = "sarammissak@gmail.com";
    String googleEmail = "smissak@google.com";

    if (userService.isUserLoggedIn() && (userService.getCurrentUser().getEmail()).equals(email) || (userService.getCurrentUser().getEmail()).equals(googleEmail)) {
      for (Entity entity : results.asIterable()) {
        datastore.delete(entity.getKey());
      }
      query = new Query("ChartData");
      results = datastore.prepare(query);

      for (Entity entity : results.asIterable()) {
        datastore.delete(entity.getKey());
      }
      
      Map<String, Long> accountIdToCommentCountMap = new HashMap<>();
      
      CommentAnalytics data = new CommentAnalytics(accountIdToCommentCountMap, results.countEntities());
      response.setContentType("application/json");
      Gson gson = new Gson();
      String json = gson.toJson(data);
      response.getWriter().println(json);
    }
  } 
}

