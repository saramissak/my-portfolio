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

  private Map<String, Integer> popularCommenters = new HashMap<>();

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
    } else {
      String email = request.getParameter("email");
      Boolean deleted = Boolean.parseBoolean(request.getParameter("deleted"));
      if (email != null && !deleted) {
        int currentVotes = popularCommenters.containsKey(email) ? popularCommenters.get(email) : 0;
        popularCommenters.put(email, currentVotes + 1);
      } else if (email != null && deleted) {
        int currentVotes = popularCommenters.containsKey(email) ? popularCommenters.get(email) : 0;
        if (currentVotes != 0) {
          popularCommenters.put(email, currentVotes - 1);
        }
      }
    }
  }
}
