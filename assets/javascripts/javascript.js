(function(){

  // Button Captures
  var introButton = $('#intro');
  var getButton = $('#get');
  var postButton = $('#post');
  var putButton = $('#put');
  var deleteButton = $('.glyphicon-remove');

  // Areas of the DOM
  var introContent = $('#introContent');
  var getContent = $('#getContent');
  var postContent = $('#postContent');
  var putContent = $('#putContent');
  var deleteContent = $('#deleteContent');
  var getTable = $('#getTable');

  var getPagination = $('#getPagination')

  // Hiding for now, as I'm unsure what I want to put in the container
  $('.apiNavigation').hide();

  // Used to reset the "active" on the anchor tags in the introContent
  function resetAttr(button) {
    introButton.attr("class", "");
    putButton.attr("class", "");
    postButton.attr("class", "");
    // deleteButton.attr("class", "");
    getButton.attr("class", "");
    button.attr("class", "active");
  };

  function resetHide(content) {
    introContent.css("display", "none");
    getContent.css("display", "none");
    postContent.css("display", "none");
    putContent.css("display", "none");
    // deleteContent.css("display", "none");
    content.css("display", "block");
  };

  function resetContent(content){
    resetAttr($(content));
    resetHide(getContent);
    $("#getTable td").remove();
    getPagination.empty();
  }

  introButton.click(function(){

    resetAttr($(this));
    resetHide(introContent);

  });

  getButton.click(function(){

    resetContent($(this));

    var getPromise = $.get( "http://localhost:1337/episode" , function( data ) {

      getPromise.done(function(data){
        var seasonNum = 0;

        for (var i = 0; i < data.length; i++) {

          var goodDate = data[i].orig_air_date;

          getTable.append(
            '<tr> <td> <span class="glyphicon glyphicon-remove delete" aria-hidden="true"></span> </td>' +
            '<td class="season">' + data[i].season + '</td>' +
            '<td class="episode">' + data[i].ep_num + '</td>' +
            '<td class="title">' + data[i].title + '</td>' +
            '<td class="description">' + data[i].description + '</td>' +
            '<td class="date">' + goodDate.substring(0, goodDate.indexOf('T')) + '</td> </tr>'
          );

          console.log(data[i].season);

          if (data[i].season != seasonNum){
            seasonNum = seasonNum + 1;

            if (data[i].season == seasonNum) {
            getPagination.append(
              '<li><a href="#/" class="seasonButton">Season ' + data[i].season + '</a></li>'
            )};
          };

          // console.log(data[i].title);

        }; // Closes for loop

      }); // Closes getPromise.done


    }); // Closes initial get

  }); // Closes getButton.click

  getPagination.on("click",".seasonButton",function(){

    var seasonButton = $(this).text();
    $("#getTable td").remove();

    // console.log(seasonButton.substr(seasonButton.indexOf(" ")));

    var getPromise = $.get( "http://localhost:1337/episode?season=" +  seasonButton.substr(seasonButton.indexOf(" ")), function( data ) {

      getPromise.done(function(data){

        for (var i = 0; i < data.length; i++) {

          var goodDate = data[i].orig_air_date;

          getTable.append(
            '<tr> <td> <span class="glyphicon glyphicon-remove delete" aria-hidden="true"></span> </td>' +
            '<td class="season">' + data[i].season + '</td>' +
            '<td class="episode">' + data[i].ep_num + '</td>' +
            '<td class="title">' + data[i].title + '</td>' +
            '<td class="description">' + data[i].description + '</td>' +
            '<td class="date">' + goodDate.substring(0, goodDate.indexOf('T')) + '</td> </tr>'
          )
        };
      });
  });
});

  postButton.click(function(){

    resetAttr($(this));
    resetHide(postContent);

  });

  putButton.click(function(){

    resetAttr($(this));
    resetHide(putContent);

  });

  // What to do when the delete button is pressed
  getTable.on("click", ".delete", function(){

    var row = $(this).closest("tr");   // Finds the closest row <tr>

    var text = row.find(".description").text();

    // $.ajax({
    //   url: 'http://localhost:1337/episode?description=' + text,
    //   type: 'DELETE', // specify request method as POST
    // });

       console.log(text);       // Outputs the answer

  });

})();
