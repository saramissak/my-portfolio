// This function implements autocompletion
function autocomplete(input, arr) {
  /*function takes the text field element and an array of possible autocompleted values:*/
  var currentFocus;

  /*execute a function when someone writes in the text field:*/
  input.addEventListener("input", function(e) {
      var autoCompleteContainer, matchEle, i, val = this.value;
      closeAllLists();
      if (!val) { 
        return false;
      }
      // starts as -1 because there are no active items or suggested items initally 
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      autoCompleteContainer = document.createElement("DIV");
      autoCompleteContainer.setAttribute("id", this.id + "autocomplete-list");
      autoCompleteContainer.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(autoCompleteContainer);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          matchEle = document.createElement("DIV");
          /*make the matching letters bold:*/
          matchEle.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          matchEle.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          matchEle.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          matchEle.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              input.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          autoCompleteContainer.appendChild(matchEle);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  input.addEventListener("keydown", function(e) {
      var currentItem = document.getElementById(this.id + "autocomplete-list");
      if (currentItem) currentItem = currentItem.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*40 indicated the down arrow key was pressed*/
        currentFocus++;
        addActive(currentItem);
      } else if (e.keyCode == 38) { //up
        /*36 indicated the up arrow key was pressed*/
        currentFocus--;
        addActive(currentItem);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (currentItem) currentItem[currentFocus].click();
        }
      }
  });
  function addActive(toClassify) {
    /*a function to classify an item as "active":*/
    if (!toClassify) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(toClassify);
    if (currentFocus >= toClassify.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (toClassify.length - 1);
    /*add class "autocomplete-active":*/
    toClassify[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(autoItems) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < autoItems.length; i++) {
      autoItems[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document, except the one passed as an argument:*/
    var itemsToClose = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < itemsToClose.length; i++) {
      if (elmnt != itemsToClose[i] && elmnt != input) {
        itemsToClose[i].parentNode.removeChild(itemsToClose[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

/*An array containing all the country names in the world:*/
var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia", 
"Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands",
"Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador",
"Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France",
"French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam",
"Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq",
"Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan",
"Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi",
"Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia",
"Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia",
"New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay",
"Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa",
"San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia",
"Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent",
"Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga",
"Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom",
"United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia",
"Zimbabwe"];

// An array containing some messages a person may start off with
var messages = ["Hi my name is", "I would like to discuss", "I hope you are well", "I am messaging you in regards to"];

/*initiate the autocomplete function on the "country" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("country"), countries);

/*initiate the autocomplete function on the "Questions_Comments_Concerns_Messages" element, and pass along the messages array as possible autocomplete values:*/
autocomplete(document.getElementById("Questions_Comments_Concerns_Messages"), messages);

