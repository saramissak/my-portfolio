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
  var phone = $('#telephone').val();
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

async function submitComment() {
  const params = new URLSearchParams();
  params.append('fname', document.getElementById('fname').value);
  params.append('lname', document.getElementById('lname').value);
  params.append('comment', document.getElementById('commentInput').value);
  params.append('clicked', 'true');
  document.getElementById('fname').value = '';
  document.getElementById('lname').value = '';
  document.getElementById('commentInput').value = '';
  await newChart("false", pageNum, params);
  getComments();
}

function getComments() {
  fetch('/data?num-results=' + document.getElementById('num-results').value + '&page=0').then(response => response.json()).then((data) => {
    
    const commentsSection = document.getElementById('comments');
    commentsSection.innerHTML = '';
    createChangePageButtons();

    data.comments.forEach((line) => {
      commentsSection.appendChild(createComment(line, data));
    });

    pageNum = 0;

    if (pageNum <= 0) {
      document.getElementById('previous-button-top').disabled = true;
      document.getElementById('previous-button-bottom').disabled = true
    } else {
      document.getElementById('previous-button-top').disabled = false;
      document.getElementById('previous-button-bottom').disabled = false;    
    }

    if (data.totalNumOfComments <= (pageNum+1)*document.getElementById('num-results').value) {
      document.getElementById('next-button-top').disabled = true;
      document.getElementById('next-button-bottom').disabled = true;
    } else {
      document.getElementById('next-button-top').disabled = false;
      document.getElementById('next-button-bottom').disabled = false;
    }
  });
}

function changePage(sign) {
  if(sign.localeCompare('+') == 0){
    pageNum++;
  } else {
    pageNum--;
  }
  fetch('/data?num-results=' + document.getElementById('num-results').value + '&page=' + pageNum).then(response => response.json()).then((data) => {
    //  This to check if you can go more backwards or forwards so you do not get any blank pages
    if (data.totalNumOfComments > pageNum*document.getElementById('num-results').value && pageNum >= 0)
    {
        createChangePageButtons();

        const commentsSection = document.getElementById('comments');
        commentsSection.innerHTML = '';

        var resultsNum = document.getElementById('num-results').value;
        var offset = (pageNum)*resultsNum;

        data.comments.forEach((line) => {
          commentsSection.appendChild(createComment(line, data));
          resultsNum--;
        });
    } else { // If you cannot go any more forward or backward reverse the change of page count
        if(sign.localeCompare('+') == 0){
           pageNum--;
        } else {
           pageNum++;
        }
    }

	console.log(pageNum);
    if (pageNum <= 0) {
      document.getElementById('previous-button-top').disabled = true;
      document.getElementById('previous-button-bottom').disabled = true
    } else {
      document.getElementById('previous-button-top').disabled = false;
      document.getElementById('previous-button-bottom').disabled = false;    
    }

	console.log(data.totalNumOfComments);
    if (data.totalNumOfComments <= (pageNum+1)*document.getElementById('num-results').value) {
      document.getElementById('next-button-top').disabled = true;
      document.getElementById('next-button-bottom').disabled = true;
    } else {
      document.getElementById('next-button-top').disabled = false;
      document.getElementById('next-button-bottom').disabled = false;
    }
  });
}

/** Creates an <div> element containing text. */
function createComment(text, data) {
  const divElement = document.createElement('div');
  divElement.id = 'comment';
  divElement.innerHTML = "<h5>" + text.fname + " " + text.lname + "</h5>";
  if (data.email != null && (data.email).localeCompare(text.email) == 0){
    divElement.innerHTML = "<h5><input type='button' value='X' onclick='deleteComment(\""+ text.key +"\")' class='right-shift'></input>" + text.fname + " " + text.lname + "</h5>";
  }
  divElement.innerHTML += "<h6>" + text.email + "</h6><p>"  + text.message + "</p><br/><br/>";
  return divElement;
}

async function deleteAllComments() {
  await newChart("null", pageNum, null);
  getComments();
  pageNum = 0;
}

/** Tells the server to delete the comment. */
async function deleteComment(comment) {
  const params = new URLSearchParams();
  params.append('id', comment);
  await newChart("true", pageNum, params);
  getComments();
}

function createChangePageButtons() {
  document.getElementById('chanegPageTop').innerHTML = "<form='GET'><input type='submit' name='page' id='previous-button-top' class='previous-button btn waves-light left-shift' value='Previous Page' onclick='changePage(\"-\")'/>" + 
  "<input type='submit' name='page'  id='next-button-top' class='next-button btn waves-light right-shift' value='Next Page' onclick='changePage(\"+\")'/></form> <br/></br><br/>";
  
  document.getElementById('chanegPageBottom').innerHTML = "<form='GET'><input type='submit' name='page' id='previous-button-bottom' class='previous-button btn waves-light left-shift' value='Previous Page' onclick='changePage(\"-\")'/>" + 
  "<input type='submit' name='page'  id='next-button-bottom' class='next-button btn waves-light right-shift' value='Next Page' onclick='changePage(\"+\")'/></form>";
}

function checkLogin() {
  fetch('/check-login').then(response => response.json()).then((data) => {
    const commentForm = document.getElementById('hidden');
    if (data.loggedIn) {
      commentForm.id = 'show';
      const loggedInAsDiv = document.getElementById('loggedInAs');
      loggedInAsDiv.innerHTML = '<p>You are logged in as ' + data.email + '. Logout <a href=\'' + data.logoutURL + '\'>here</a>.</p>';
      loggedInAsDiv.innerHTML += '<div id="hidden"><input id="submitted-email" value="'+ data.email +'" name="'+ data.email +'"></div>'
    } else {
      const loginDiv = document.getElementById('login');
      loginDiv.innerHTML = '<p>You are not logged in to leave a comment. Login <a href=\'' + data.loginURL + '\'>here</a>.</p>'
    }
  });
}

function checkLoginForDeleteAllButton() {
  fetch('/check-login').then(response => response.json()).then((data) => {
    const commentsSection = document.getElementById('deleteAll');
    if ((data.email).localeCompare("Sarammissak@gmail.com") == 0 || (data.email).localeCompare("smissak@google.com") == 0) {
      commentsSection.id = 'deleteAllShow';
    }
  });
}

function onLoadFunctions() {
  addRandomFact("fact-container1"); 
  getComments(); 
  checkLogin();
  createMap();
  checkLoginForDeleteAllButton();
  createChangePageButtons();
  drawChart(new Request('/data', {method: 'POST'}));
}
