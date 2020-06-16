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


@WebServlet("/chart-data")
public class ChartServlet extends HttpServlet {

  private final Map<String, Integer> popularCommenters = new HashMap<>();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");
    Gson gson = new Gson();
    String json = gson.toJson(popularCommenters);
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {  
    if (("null").equals(request.getParameter("deleted"))) {
      popularCommenters.clear();
      return;
    } 

    String email = request.getParameter("email");
    if (email == null) {
        return;
    }

    int currentVotes = popularCommenters.getOrDefault(email, 0);
    Boolean deleted = Boolean.parseBoolean(request.getParameter("deleted"));
    if (!deleted) {
      popularCommenters.put(email, currentVotes + 1);
    } else {
      // This is the case where the comment is deleted not submitted
      if (currentVotes != 0) {
        popularCommenters.put(email, currentVotes - 1);
      }
    }
  }
}


