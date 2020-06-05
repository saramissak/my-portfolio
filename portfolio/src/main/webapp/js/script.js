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


// gets the parameter from query string
function getParameter(id, defaultVal) {
    let tmp = (new URL(document.location)).searchParams;
    let res = tmp.get(id);
    if(!res || res.length === 0) {
        return defaultVal;
    }
    return res;
}


function getComments() {
//   console.log("getting phrase from /data");

//   const responsePromise = fetch('/data?num-results=' + getParameter('num-results', "10") + "&page=" + getParameter("page", "0"));

//   // When the request is complete, pass the response into handleResponse().
//   responsePromise.then(handleResponse);

    fetch('/data?num-results=' + getParameter('num-results', "10") + "&page=" + getParameter("page", "0")).then(response => response.json()).then((messages) => {
        const comments = document.getElementById("comments");

        messages.forEach((line) => {
            comments.appendChild(createComment(line));
        });
    });
}

/** Creates an <li> element containing text. */
function createComment(text) {
  const divElement = document.createElement("div");
  divElement.innerHTML = "<h5>" + text.fname + " " + text.lname + "</h5><p>" + text.message + "</p>";
  return divElement;
}


function handleResponse(response) {
  console.log('Handling the response.');

  // response.text() returns a Promise, because the response is a stream of
  // content and not a simple variable.
  const textPromise = response.text();

  // When the response is converted to text, pass the result into the
  // addQuoteToDom() function.
  textPromise.then(addQuoteToDom);
}

/** Adds a random quote to the DOM. */
function addQuoteToDom(quote) {
  console.log('Adding quote to dom: ' + quote);

  const quoteContainer = document.getElementById('comments');
  quoteContainer.innerHTML = quote;
}

function deleteAllComments() {
  const request = new Request('/delete-data', {method: 'POST'});
  const responsePromise = fetch(request);
}

/** Tells the server to delete the task. */
function deleteComment(comment) {
  const params = new URLSearchParams();
  params.append('id', comment);
  const request = new Request('/delete-comment', {method: 'POST', body: params});

  const responsePromise = fetch(request);
}

function nextPage(page) {
  const responsePromise = fetch('/data?num-results=' + getParameter('num-results', "10") + "&page=" + page);
    console.log(responsePromise);
  // When the request is complete, pass the response into handleResponse().
  responsePromise.then(handleResponse);
}
