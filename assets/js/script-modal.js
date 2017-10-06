// Initialize Firebase
var config = {
  apiKey: "AIzaSyBu8614Esq3Mol0lqM4lnItwO2DVkR6rB0",
  authDomain: "eventup-d2d0f.firebaseapp.com",
  databaseURL: "https://eventup-d2d0f.firebaseio.com",
  projectId: "eventup-d2d0f",
  storageBucket: "eventup-d2d0f.appspot.com",
  messagingSenderId: "432676700522"
};
firebase.initializeApp(config);

var database = firebase.database();

var userSelected;
var userCityEB;
var userCityMeetUp;
var userName;


// variables for trending topics 
var topicCount = {
  topicCountSports: 0,
  topicCountArt: 0,
  topicCountTechnology: 0,
  topicCountOutdoors: 0,
  topicCountMusic: 0,
  topicCountFashion: 0,
  topicCountCareers: 0,
  topicCountGaming: 0,
  topicCountFamily: 0
}

var trendingTopics = [];
var top3Topics = [];

// At the initial load, get a snapshot of the current data and find trending topics.
database.ref().on("value", function(snapshot) {
  var firebaseData = snapshot.val()
  for (var key in firebaseData) {
    countTopics(firebaseData[key].topic);
  };
  trendingTopics = sortObject(topicCount);
  top3Topics = findTrendingTopics(trendingTopics);
  // Need to code this function!!! /
  displayTrending(top3Topics);
});

//Apend trending topics
function displayTrending(arr) {
  $("#trending-results").empty();
  // console.log(arr);
  $("#trending-results").append(
    `<p>Top 3 Trending Results: ${arr[0].tempString}, ${arr[1].tempString}, ${arr[2].tempString}  </p>
    `

  )

}


function findTrendingTopics(data) {
  var arr = [];
  var tempString;
  for (var i = 0; i < 3; i++) {
    tempString = data[i].key;
    tempString = tempString.replace("topicCount", "");
    arr.push({
      tempString
    });
  };
  return arr; // returns array
}


// Function that counts topics and updates global variables

function countTopics(value) {
  if (value === "sports") {
    topicCount.topicCountSports++;
  } else if (value === "art") {
    topicCount.topicCountArt++;
  } else if (value === "technology") {
    topicCount.topicCountTechnology++;
  } else if (value === "outdoors") {
    topicCount.topicCountOutdoors++;
  } else if (value === "music") {
    topicCount.topicCountMusic++;
  } else if (value === "fashion") {
    topicCount.topicCountFashion++;
  } else if (value === "careers") {
    topicCount.topicCountCareers++;
  } else if (value === "gaming") {
    topicCount.topicCountGaming++;
  } else if (value === "family") {
    topicCount.topicCountFamily++;
  }
};

// Function to Clear Count Variables
function clearCountVariables() {
  topicCount.topicCountSports = 0;
  topicCount.topicCountArt = 0;
  topicCount.topicCountTechnology = 0;
  topicCount.topicCountOutdoors = 0;
  topicCount.topicCountMusic = 0;
  topicCount.topicCountFashion = 0;
  topicCount.topicCountCareers = 0;
  topicCount.topicCountGaming = 0;
  topicCount.topicCountFamily = 0;
};

// Function to Sort an Object
function sortObject(obj) {
  var arr = [];
  var key;
  for (key in obj) {
    arr.push({
      'key': key,
      'value': obj[key]
    });
  };
  arr.sort(function(a, b) {
    return b.value - a.value;
  });
  return arr; // returns array
};

//End of query Firebase


//click button to capture city from radio button
$(document).on("click", ".city-btn", function() {
  userCityEB = $(this).attr("data-city");
  userCityMeetUp = $(this).attr("data-meetup");
  userName = $("#name-input").val().trim();
});


//Adding new profiles to firebase and call api
$(document).on("click", ".gallery__preview", function() {
  userSelected = $(this).attr("data-topic");
  runajax(userSelected, userCityEB, userCityMeetUp);
  runFirebase(userName, userSelected, userCityEB, userCityMeetUp);

});




var runFirebase = function(userName, userSelected, userCityEB, userCityMeetUp) {

  //create a local "temp" object for holding new profile added
  var newProfile = {
    name: userName,
    topic: userSelected,
    ebCity: userCityEB,
    mpCity: userCityMeetUp
  };

  //Uploading new profiles info to firebase database
  database.ref().push(newProfile);

  // Clears Count Variables // Dario
  clearCountVariables();

  //Creating Firebase even for adding new profiles

  database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    // console.log(childSnapshot.val());

    //stores everything into firebase variable
    var userName = childSnapshot.val().name;
    var userSelected = childSnapshot.val().topic;
    var userCityEB = childSnapshot.val().ebCity;
    var userCityMeetUp = childSnapshot.val().mpCity;

    //CALL COUNTING FUNCTION
    countTopics(userSelected);

    //Handles the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  }); //End of api call and firebase push

  // Check Topics Count Object

  trendingTopics = sortObject(topicCount);
  top3Topics = findTrendingTopics(trendingTopics);
  // Need to code this function!!!
  displayTrending(top3Topics);

} // end of runFirebase



var runajax = function(userSelected, userCityEB, userCityMeetUp) {

  var queryURLeb = "https://www.eventbriteapi.com/v3/events/search/?token=CDKLCBINAPTPOB3IKFWE&q=" + userSelected + "&location.address=" + userCityEB;

  $.ajax({
    url: queryURLeb,
    method: "GET",
    success: function() {}
  }).done(function(response) {
    var resultsEB = response;

    $("#eventbrite-results").empty()
    var dataEB = response.events;

    for (var i = 0; i < dataEB.length; i++) {
      var loopDataEB = response.events[i]

      if (loopDataEB.logo === null) {

        $("#eventbrite-results").append(

          `<div class="masonry-result">
                  <img class="d-flex align-self-start mr-3 results-events-img" src="https://media1.giphy.com/media/d3yxg15kJppJilnW/giphy.gif?fingerprint=e1bb72ff59d32d997858774c4dd609ea">
                   <h3 class="modal-header-title"> ${loopDataEB.name.html} </h3>
                   <p class="modal-date"> ${loopDataEB.start.utc} </p>
                   <p class="modal-link-event"><a href = "${loopDataEB.url}" target="_blank"> Learn More </a></div>
                   </div>
                `

        ) //end of append eventbrite


      } else {
        $("#eventbrite-results").append(

          `<div class="masonry-result">
                <img class="d-flex align-self-start mr-3 results-events-img" src="${loopDataEB.logo.url}">
                 <h3 class="modal-header-title"> ${loopDataEB.name.html} </h3>
                 <p class="modal-date"> ${loopDataEB.start.utc} </p>
                 <p class="modal-link-event"><a href = "${loopDataEB.url}" target="_blank"> Learn More </a></div>
                 </div>
              `
        ) //end of append eventbrite

      } // end of eventbrite forloop
    }
    // <div class="modal-descip"> ${loopDataEB.description.html} </div>

    // console.log(resultsEB);
    // console.log(userCityMeetUp);

    var queryURLmu = "https://api.meetup.com/2/open_events?&sign=true&photo-host=public&country=US&topic=" + userSelected + "&city=" + userCityMeetUp + "&state=CA&page=50&key=6073131471a217a1240677f485a497c"

    $.ajax({
      url: queryURLmu,
      method: "GET",
      dataType: 'jsonp',
      success: function(data) {
        $('.text').text(JSON.stringify(data));
      },

    }).done(function(response) {
      var resultsMU = response;
      $("#meetup-results").empty()


      for (var i = 0; i < response.results.length; i++) {

        // console.log(resultsMU);
        var loopDataMP = response.results[i]
        var venue = response.results[i].venue

        if (venue) {
          if (venue.city === userCityMeetUp) {

            // console.log(venue.city);
            // console.log(response.results[i].name);
            // console.log(response.results[i].group.name)
            //console.log(response.results[i].event_url);
            // console.log(response.results[i].description);

            //end of append meetup
            var sportsImage = '<img class="d-flex align-self-start mr-3 results-events-img" src="https://media.giphy.com/media/TrXccx2cCI6Xu/giphy.gif">'

            var artsImage = '<img class="d-flex align-self-start mr-3 results-events-img" src="https://media.giphy.com/media/gVJKzDaWKSETu/giphy.gif">'

            var tecImage = '<img class="d-flex align-self-start mr-3 results-events-img" src="https://media.giphy.com/media/26tOY3KjQUL9YhRT2/giphy.gif">'

            var outdoorsImage = '<img class="d-flex align-self-start mr-3 results-events-img" src="https://media.giphy.com/media/lMUGMp2lImgGA/giphy.gif">'

            var musicImage = '<img class="d-flex align-self-start mr-3 results-events-img" src="https://media.giphy.com/media/IXT16ltI7K2nC/giphy.gif">'

            var fashionImage = '<img class="d-flex align-self-start mr-3 results-events-img" src="https://media.giphy.com/media/3o6ZsX760AIw9XnqA8/giphy.gif">'

            var careersImage = '<img class="d-flex align-self-start mr-3 results-events-img" src="https://media.giphy.com/media/VN1FNL6Lqc0vu/giphy.gif">'

            var gamingImage = '<img class="d-flex align-self-start mr-3 results-events-img" src="https://media.giphy.com/media/1wh06XT53tPGw/giphy.gif">'

            var family = '<img class="d-flex align-self-start mr-3 results-events-img" src="https://media.giphy.com/media/26hirMtUp7F4Yp2jC/giphy.gif">'

            function meetupDiv(imageMp) {
              $("#meetup-results").append(
                `<div class="masonry-result">
                        ${imageMp}
                        <h3 class="modal-header-title"> ${loopDataMP.name} </h3>
                        <p class="modal-location"> ${loopDataMP.venue.city} </p>
                        <div class="modal-descip"> ${loopDataEB.description.html} </div>
                        <p class="modal-link-event"><a href ="${response.results[i].event_url}" target="_blank"> Learn More </a></div>
                        </div>`
              )
            };

            if (userSelected === "sports") {
              meetupDiv(sportsImage);
            } else if (userSelected === "art") {
              meetupDiv(artsImage);
            } else if (userSelected === "technology") {
              meetupDiv(artsImage);
            } else if (userSelected === "outdoors") {
              meetupDiv(outdoorsImage);
            } else if (userSelected === "music") {
              meetupDiv(musicImage);
            } else if (userSelected === "fashion") {
              meetupDiv(userSelected);
            } else if (userSelected === "careers") {
              meetupDiv(careersImage);
            } else if (userSelected === "gaming") {

              meetupDiv(gamingImage);
            } else if (userSelected === "family") {
              meetupDiv(familyImage);
            }

          } //end of venue.city if statement
        } //end of venue if

      } //end of forloop

    }); //END OF 2ND AJAX

  }); //END of 1st ajax

}; //End of RunAJAX
