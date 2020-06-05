package com.google.sps.data;

import java.util.ArrayList;

public class TotalComments {
    public int totalNumOfComments;
    public ArrayList<Comment> comments;

    public TotalComments(ArrayList<Comment> comments, int totalNumOfComments) {
        this.totalNumOfComments = totalNumOfComments;
        this.comments = new ArrayList<>(comments);
    }
}
