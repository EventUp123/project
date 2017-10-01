var userSelected;
var userCity;
var userCityMeetUp;

$(document).on("click", ".gallery__preview", function (){
    userSelected = $(this).attr("data-topic");
  console.log(userSelected);
      runajax(userSelected, userCity, userCityMeetUp);
})



$(document).on("click", ".city-btn", function (){
    userCity = $(this).attr("data-city");
    userCityMeetUp = $(this).attr("data-meetup");
  console.log(userCity);
  console.log(userCityMeetUp);
})


// console.log("userSelected");
//
// $(".submit").on("click", function(){
//
//   console.log(userSelected);
//     runajax(userSelected, userCity);
//
// //evoke firebase function
// })


    // var q = $(this).attr("data-name");
    // var


//create a fucntion that will push to firebase




var runajax  = function(userSelected, userCity, userCityMeetUp){

  console.log(userSelected);

  var queryURLeb = "https://www.eventbriteapi.com/v3/events/search/?token=CDKLCBINAPTPOB3IKFWE&q=" + userSelected + "&location.address=" + userCity;

    console.log(queryURLeb);


    $.ajax({
      url: queryURLeb,
      method: "GET"
    }).done(function(response) {
      var resultsEB = response;
      console.log(resultsEB);
        console.log(userCityMeetUp);


      $.ajax({
        url: $('#myModal').val(),
        type: "POST",
        data: { Request: Request },
        dataType: "json",
        success: function () {
          $("#eventup-modal").modal('show'); // modal popup's but refNo doesn't show.





//Meetup Ajax
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
            console.log(resultsMU);
            for (var i = 0; i < response.results.length; i++) {

              // console.log(response.results);

              var venue = response.results[i].venue

              if(venue) {
                if (venue.city === userCityMeetUp) {
                console.log("hi");
                console.log(venue.city);
                console.log(response.results[i].name);
                console.log(response.results[i].group.name)
                }
              }
            }//end of forloop

          });//END OF 2ND AJAX


        }//end of sucess function
      });//end of ajax modal

});//END of 1st ajax
            };//end of runajax
