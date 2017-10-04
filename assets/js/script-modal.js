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



//click button to capture city from radio button
$(document).on("click", ".city-btn", function (){
    userCityEB = $(this).attr("data-city");
    userCityMeetUp = $(this).attr("data-meetup");
    userName= $("#name-input").val().trim();
  console.log(userCityEB);
  console.log(userCityMeetUp);
  console.log(userName);
  console.log("hello");

});


//Adding new profiles to firebase and call api
$(document).on("click", ".gallery__preview", function (){
    userSelected = $(this).attr("data-topic");
    console.log(userSelected);
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

    //Testing input with console logs
    // console.log(newProfile.userName);

    //Clears all input boxes upon submit to database
    $("#name-input").val("");

    //Creating Firebase even for adding new profiles

    database.ref().on("child_added", function(childSnapshot, prevChildKey){

        console.log(childSnapshot.val());

        //stores everything into firebase variable
        var userName = childSnapshot.val().name;
        var userSelected = childSnapshot.val().topic;
        var userCityEB = childSnapshot.val().ebCity;
        var userCityMeetUp = childSnapshot.val().mpCity;

    //CREATE COUNTING FUNCTION

    //Handles the errors
    }, function(errorObject) {
          console.log("Errors handled: " + errorObject.code);
        });

  //End of api call and firebase push

} // end of runFirebase



var runajax  = function(userSelected, userCityEB, userCityMeetUp){

  // console.log(userSelected);

  var queryURLeb = "https://www.eventbriteapi.com/v3/events/search/?token=CDKLCBINAPTPOB3IKFWE&q=" + userSelected + "&location.address=" + userCityEB;

    console.log(queryURLeb);


    $.ajax({
      url: queryURLeb,
      method: "GET",
      success: function(){}
    }).done(function(response) {
      var resultsEB = response;

      // console.log(response.events[0].name[0]);
      // console.log(response.events[0].description);
      // console.log(response.events[0].url);
      // console.log(response.events[0].logo.url);

        $("#eventbrite-results").empty()
        var dataEB = response.events;

        for (var i = 0; i < dataEB.length; i++){
          var loopDataEB = response.events[i]


          // var image = loopDataEB.logo.url || "http://via.placeholder.com/350x150"
          // console.log(image);
          if(loopDataEB.logo === null){
            // var newImage = $('<img class="d-flex align-self-start mr-3" id="results-events-img" src="http://via.placeholder.com/350x150">');

            $("#eventbrite-results").append(

                `<div class="masonry-result">
                  <img class="d-flex align-self-start mr-3 results-events-img" src="https://media1.giphy.com/media/d3yxg15kJppJilnW/giphy.gif?fingerprint=e1bb72ff59d32d997858774c4dd609ea">
                   <h3 class="modal-header-title"> ${loopDataEB.name.html} </h3>
                   <p class="modal-date"> ${loopDataEB.start.utc} </p>
                   <p class="modal-link-event"><a href = "${loopDataEB.url}" target="_blank"> Learn More </a></div>
                   </div>
                `

              )//end of append eventbrite



            console.log("hello");
          } else {
          $("#eventbrite-results").append(

              `<div class="masonry-result">
                <img class="d-flex align-self-start mr-3 results-events-img" src="${loopDataEB.logo.url}">
                 <h3 class="modal-header-title"> ${loopDataEB.name.html} </h3>
                 <p class="modal-date"> ${loopDataEB.start.utc} </p>
                 <p class="modal-link-event"><a href = "${loopDataEB.url}" target="_blank"> Learn More </a></div>
                 </div>
              `

            )//end of append eventbrite

        }// end of eventbrite forloop
}
// <div class="modal-descip"> ${loopDataEB.description.html} </div>

      console.log(resultsEB);
      console.log(userCityMeetUp);

          var queryURLmu = "https://api.meetup.com/2/open_events?&sign=true&photo-host=public&country=US&topic=" + userSelected + "&city=" + userCityMeetUp+ "&state=CA&page=50&key=6073131471a217a1240677f485a497c"

          $.ajax({
            url: queryURLmu,
            method: "GET",
            dataType: 'jsonp',
            success: function(data) {
            $('.text').text(JSON.stringify(data));
          },

            }).done(function(response) {
            var resultsMU = response;

            for (var i = 0; i < response.results.length; i++) {

              console.log(resultsMU);
              var loopDataMP = response.results[i]
              var venue = response.results[i].venue

              if(venue) {
                if (venue.city === userCityMeetUp) {

                // console.log(venue.city);
                // console.log(response.results[i].name);
                // console.log(response.results[i].group.name)
                // console.log(response.results[i].event_url);
                // console.log(response.results[i].description);
                if (userSelected === "sports"){
                //create if statement
                $("#meetup-results").append(
                    `<div class="masonry-result">
                    <img class="d-flex align-self-start mr-3 results-events-img" src="https://media.giphy.com/media/TrXccx2cCI6Xu/giphy.gif">
                    <h3 class="modal-header-title"> ${loopDataMP.name} </h3>
                     <p class="modal-location"> ${loopDataMP.venue.city} </p>
                    <div class="modal-descip"> ${loopDataEB.description.html} </div>
                    <p class="modal-link-event"><a href = "${loopDataEB.event_url}" target="_blank"> Learn More </a></div>
                    </div>
                    `
                  )//end of append meetup
                }//end of userSelected sports

                if (userSelected === "art"){
                //create if statement
                $("#meetup-results").append(
                    `<div class="masonry-result">
                    <img class="d-flex align-self-start mr-3 results-events-img" src="https://media.giphy.com/media/gVJKzDaWKSETu/giphy.gif">
                    <h3 class="modal-header-title"> ${loopDataMP.name} </h3>
                     <p class="modal-location"> ${loopDataMP.venue.city} </p>
                    <div class="modal-descip"> ${loopDataEB.description.html} </div>
                    <p class="modal-link-event"><a href = "${loopDataEB.event_url}" target="_blank"> Learn More </a></div>
                    </div>
                    `
                  )//end of append meetup
                }//end of userSelected art

                if (userSelected === "technology"){
                //create if statement
                $("#meetup-results").append(
                    `<div class="masonry-result">
                    <img class="d-flex align-self-start mr-3 results-events-img" src="https://media.giphy.com/media/26tOY3KjQUL9YhRT2/giphy.gif">
                    <h3 class="modal-header-title"> ${loopDataMP.name} </h3>
                     <p class="modal-location"> ${loopDataMP.venue.city} </p>
                    <div class="modal-descip"> ${loopDataEB.description.html} </div>
                    <p class="modal-link-event"><a href = "${loopDataEB.event_url}" target="_blank"> Learn More </a></div>
                    </div>
                    `
                  )//end of append meetup
                }//end of userSelected technology

                if (userSelected === "outdoors"){
                //create if statement
                $("#meetup-results").append(
                    `<div class="masonry-result">
                    <img class="d-flex align-self-start mr-3 results-events-img" src="https://media.giphy.com/media/lMUGMp2lImgGA/giphy.gif">
                    <h3 class="modal-header-title"> ${loopDataMP.name} </h3>
                     <p class="modal-location"> ${loopDataMP.venue.city} </p>
                    <div class="modal-descip"> ${loopDataEB.description.html} </div>
                    <p class="modal-link-event"><a href = "${loopDataEB.event_url}" target="_blank"> Learn More </a></div>
                    </div>
                    `
                  )//end of append meetup
                }//end of userSelected outdoors

                if (userSelected === "music"){
                //create if statement
                $("#meetup-results").append(
                    `<div class="masonry-result">
                    <img class="d-flex align-self-start mr-3 results-events-img" src="https://media.giphy.com/media/IXT16ltI7K2nC/giphy.gif">
                    <h3 class="modal-header-title"> ${loopDataMP.name} </h3>
                     <p class="modal-location"> ${loopDataMP.venue.city} </p>
                    <div class="modal-descip"> ${loopDataEB.description.html} </div>
                    <p class="modal-link-event"><a href = "${loopDataEB.event_url}" target="_blank"> Learn More </a></div>
                    </div>
                    `
                  )//end of append meetup
                }//end of userSelected music

                if (userSelected === "fashion"){
                //create if statement
                $("#meetup-results").append(
                    `<div class="masonry-result">
                    <img class="d-flex align-self-start mr-3 results-events-img" src="https://media.giphy.com/media/3o6ZsX760AIw9XnqA8/giphy.gif">
                    <h3 class="modal-header-title"> ${loopDataMP.name} </h3>
                     <p class="modal-location"> ${loopDataMP.venue.city} </p>
                    <div class="modal-descip"> ${loopDataEB.description.html} </div>
                    <p class="modal-link-event"><a href = "${loopDataEB.event_url}" target="_blank"> Learn More </a></div>
                    </div>
                    `
                  )//end of append meetup
                }//end of userSelected fashion

                if (userSelected === "careers"){
                //create if statement
                $("#meetup-results").append(
                    `<div class="masonry-result">
                    <img class="d-flex align-self-start mr-3 results-events-img" src="https://media.giphy.com/media/VN1FNL6Lqc0vu/giphy.gif">
                    <h3 class="modal-header-title"> ${loopDataMP.name} </h3>
                     <p class="modal-location"> ${loopDataMP.venue.city} </p>
                    <div class="modal-descip"> ${loopDataEB.description.html} </div>
                    <p class="modal-link-event"><a href = "${loopDataEB.event_url}" target="_blank"> Learn More </a></div>
                    </div>
                    `
                  )//end of append meetup
                }//end of userSelected careers



                if (userSelected === "gaming"){
                //create if statement
                $("#meetup-results").append(
                    `<div class="masonry-result">
                    <img class="d-flex align-self-start mr-3 results-events-img" src="https://media.giphy.com/media/1wh06XT53tPGw/giphy.gif">
                    <h3 class="modal-header-title"> ${loopDataMP.name} </h3>
                     <p class="modal-location"> ${loopDataMP.venue.city} </p>
                    <div class="modal-descip"> ${loopDataEB.description.html} </div>
                    <p class="modal-link-event"><a href = "${loopDataEB.event_url}" target="_blank"> Learn More </a></div>
                    </div>
                    `
                  )//end of append meetup
                }//end of userSelected gaming


                if (userSelected === "family"){
                //create if statement
                $("#meetup-results").append(
                    `<div class="masonry-result">
                    <img class="d-flex align-self-start mr-3 results-events-img" src="https://media.giphy.com/media/26hirMtUp7F4Yp2jC/giphy.gif">
                    <h3 class="modal-header-title"> ${loopDataMP.name} </h3>
                     <p class="modal-location"> ${loopDataMP.venue.city} </p>
                    <div class="modal-descip"> ${loopDataEB.description.html} </div>
                    <p class="modal-link-event"><a href = "${loopDataEB.event_url}" target="_blank"> Learn More </a></div>
                    </div>
                    `
                  )//end of append meetup
                }//end of userSelected careers







              }//end of venue.city if statement
            }//end of venue if

            }//end of forloop

          });//END OF 2ND AJAX

});//END of 1st ajax

}; //End of RunAJAX
