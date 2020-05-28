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
function addRandomFact() {
  const facts =
      ['My favorite color is lime green.', 'I lived my whole life in New Jersey so far. Except for when I am in college.', 
      'My inital interest in computer science started when I was watching my brother play video games.', 
      'My favorite drink is soda.', 
      'I am addicted to soda.',
      'A hobby of mine is doing nails.'];

  // Pick a random greeting.
  const fact = facts[Math.floor(Math.random() * facts.length)];

  // Add it to the page.
  const factContainer = document.getElementById('fact-container');
  factContainer.innerText = fact;
}

function validate() {
    var phone = $("#telephone").val();
    if (phone.length != 10 || isNaN(phone)) {
        alert("Phone  number is not valid or not valid format.");
        return false;
    }
}