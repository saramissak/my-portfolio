package com.google.sps.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.String;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.FetchOptions;
import java.util.List;


@WebServlet("/add-marker")
public class MapServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");
    Query query = new Query("Markers");
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);
    List<Entity> entities = results.asList(FetchOptions.Builder.withLimit(results.countEntities()));

    Gson gson = new Gson();
    String json = gson.toJson(entities);
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {  
    String latlng = (String) request.getParameter("latlng");
    Entity markerEntity = new Entity("Markers");
    markerEntity.setProperty("latlng", latlng); 
      
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(markerEntity);
  }
}


