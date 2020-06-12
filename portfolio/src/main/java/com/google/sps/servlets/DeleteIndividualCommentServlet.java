
package com.google.sps.servlets;

import com.google.sps.data.TotalComments;
import com.google.sps.data.Comment;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Key;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.appengine.api.datastore.EntityNotFoundException;
import java.util.HashMap;
import java.util.Map;

/** Servlet responsible for deleting tasks. */
@WebServlet("/delete-comment")
public class DeleteIndividualCommentServlet extends HttpServlet {

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Key id = KeyFactory.stringToKey(request.getParameter("id"));

    Query query = new Query("Messages").addSort("timestamp", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    UserService userService = UserServiceFactory.getUserService();
	
    if (!userService.isUserLoggedIn()) {
	  return;
    }

    try {
      Entity user = datastore.get(id);
      String userEmail = (String) user.getProperty("email");

      if (!(userService.getCurrentUser().getEmail()).equals(userEmail)) {
        return;
      }
      datastore.delete(id);
      
      query = new Query("ChartData");
      PreparedQuery results = datastore.prepare(query);

      Map<String, Long> commentersCount = new HashMap<>();

      for (Entity entity : results.asIterable()) {
        if (entity.getProperty("email").equals(userEmail))
        {
          long count = (long) entity.getProperty("numOfComments");
          entity.setProperty("numOfComments", Math.max(0, count - 1));
          datastore.put(entity);
        }
        commentersCount.put((String) entity.getProperty("email"), (long) entity.getProperty("numOfComments"));
      }

      commentersCount = Comment.nLargestCommenters(commentersCount, 10);
      response.setContentType("application/json");
      Gson gson = new Gson();
      String json = gson.toJson(commentersCount);
      response.getWriter().println(json);

    } catch (EntityNotFoundException e) {
	  return;
    }
  }
}
