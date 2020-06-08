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

/**
 * Adds a random greeting to the page.
 */
var pageNum = 0;

function addRandomFact(id) {
  const facts =
      ['My favorite color is lime green.', 'I lived my whole life in New Jersey so far. Except for when I am in college.', 
      'My inital interest in computer science started when I was watching my brother play video games.', 
      'My favorite drink is soda.', 
      'I am addicted to soda.',
      'A hobby of mine is doing nails.'];

  // Pick a random greeting.
  const fact = facts[Math.floor(Math.random() * facts.length)];

  // Add it to the page.
  const factContainer = document.getElementById(id);
  factContainer.innerHTML = fact;
}

function validatePhoneNumber() {
  var phone = $("#telephone").val();
  var phoneNum = /^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/g;
  if(phone.match(phoneNum)) {
    document.getElementById('invalid').innerHTML = "<p style='color:gray'> Phone Number</p>";
    return true;
  } else
  {	   
    document.getElementById('invalid').innerHTML = "<p style='color:red'> Phone Number</p>";
    return false;
  }
}

function getComments() {
    fetch('/data?num-results=' + document.getElementById("num-results").value + '&page=0').then(response => response.json()).then((data) => {
        const commentsSection = document.getElementById("comments");
        commentsSection.innerHTML = "";
        createChangePageButtons();

        var i = 0; 
        pageNum = 0;
        data.comments.forEach((line) => {
            if(i < (document.getElementById("num-results").value))
                commentsSection.appendChild(createComment(line));
            i++;
        });
    });
}

function changePage(sign) {
  if(sign.localeCompare("+") == 0){
      pageNum++;
  } else {
      pageNum--;
  }
  fetch('/data?num-results=' + document.getElementById("num-results").value + '&page=' + pageNum).then(response => response.json()).then((data) => {
    //  This to check if you can go more backwards or forwards so you do not get any blank pages
    if (data.totalNumOfComments > pageNum*document.getElementById("num-results").value && pageNum >= 0)
    {
        createChangePageButtons();

        const commentsSection = document.getElementById("comments");
        commentsSection.innerHTML = "";

        var resultsNum = document.getElementById("num-results").value;
        var offset = (pageNum)*resultsNum;

        data.comments.forEach((line) => {
          commentsSection.appendChild(createComment(line));
          resultsNum--;
        });
    } else { // If you cannot go any more forward or backward reverse the change of page count
        if(sign.localeCompare("+") == 0){
           pageNum--;
        } else {
           pageNum++;
        }
    }
  });
}



/** Creates an <div> element containing text. */
function createComment(text) {
  const divElement = document.createElement("div");
  divElement.id = 'comment';
  divElement.innerHTML = "<h5><a onclick='deleteComment(\""+ text.key +"\")' class='right-shift'>X</a>"  + text.fname + " " + text.lname + "</h5><p>"  + 
   text.message + "</p><br/><br/>";
  return divElement;
}

function deleteAllComments() {
  const request = new Request('/delete-data', {method: 'POST'});
  fetch(request);
  getComments();
}

/** Tells the server to delete the comment. */
function deleteComment(comment) {
  const params = new URLSearchParams();
  params.append('id', comment);
  const request = new Request('/delete-comment', {method: 'POST', body: params});
  fetch(request);
  getComments();
}

function createChangePageButtons() {
  document.getElementById("chanegPageTop").innerHTML = "<form='GET'><input type='submit' name='page' value='Previous Page' onclick='changePage(\"-\")'/>" + 
  "<input type='submit' name='page' value='Next Page' onclick='changePage(\"+\")'/></form>";
  
  document.getElementById("chanegPageBottom").innerHTML = "<form='GET'><input type='submit' name='page' value='Previous Page' onclick='changePage(\"-\")'/>" + 
  "<input type='submit' name='page' value='Next Page' onclick='changePage(\"+\")'/></form>";
}

function checkLogin() {
    fetch('/check-login').then(response => response.json()).then((data) => {
        const commentForm = document.getElementById("hidden");
        console.log(data.loggedIn);
        if (data.loggedIn) {
            commentForm.id = "show";
            const loggedInAsDiv = document.getElementById("loggedInAs");
            loggedInAsDiv.innerHTML = "<p>You are logged in as " + data.email + ". Logout <a href=\"" + data.logoutURL + "\">here</a>.</p>";
        } else {
            const loginDiv = document.getElementById("login");
            loginDiv.innerHTML = "<p>You are not logged in to leave a comment. Login <a href=\"" + data.loginURL + "\">here</a>.</p>"
        }
    });
}
