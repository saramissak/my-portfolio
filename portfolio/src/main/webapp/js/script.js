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
