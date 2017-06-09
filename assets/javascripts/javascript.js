(function(){

  // Button Captures
  var introButton = $('#intro');
  var getButton = $('#get');
  var postButton = $('#post');
  var putButton = $('#put');
  var deleteButton = $('.glyphicon-remove');
  var addButton = $('.glyphicon-add');
  var addTable = $('.addTable');
  var resetTable = $('.resetTable');
  var allSeasons = $('#allSeasons');

  // Areas of the DOM
  var introContent = $('#introContent');
  var getContent = $('#getContent');
  var postContent = $('#postContent');
  var putContent = $('#putContent');
  var deleteContent = $('#deleteContent');
  var getTable = $('#getTable');
  var postTable = $('#postTable');
  var alert = $('.alert_container');

  var getPagination = $('#getPagination')

  // Hiding for now, as I'm unsure what I want to put in the container
  $('.apiNavigation').hide();

  // Used to reset the "active" on the anchor tags in the introContent
  function resetAttr(button) {
    introButton.attr("class", "");
    putButton.attr("class", "");
    postButton.attr("class", "");
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
    // resetAttr(content);
    resetHide(getContent);
    $("#getTable td").remove();
    getPagination.empty();
    getPagination.append('<li><a href="#/" id="allSeasons">All Seasons</a></li>');

  }

  function getData(){

    resetContent($(this));

    var getPromise = $.get( "http://localhost:1337/episode" , function( data ) {

      getPromise.done(function(data){
        var seasonNum = 0;

        for (var i = 0; i < data.length; i++) {

          var goodDate = data[i].orig_air_date;

          getTable.append(
            '<tr> <td> <span class="glyphicon glyphicon-remove delete" aria-hidden="true" data-episodeID="' + data[i].id +
            '"></span> </td>' +
            '<td class="season">' + data[i].season + '</td>' +
            '<td class="episode">' + data[i].ep_num + '</td>' +
            '<td class="title">' + data[i].title + '</td>' +
            '<td class="description">' + data[i].description + '</td>' +
            '<td class="date">' + goodDate.substring(0, goodDate.indexOf('T')) + '</td> </tr>'
          );

          // console.log(data[i].season);

          if (data[i].season != seasonNum){
            seasonNum = data[i].season;

            // if (data[i].season == seasonNum) {
            getPagination.append('<li><a href="#/" class="seasonButton">Season ' + data[i].season + '</a></li>'
            );
          };

          // console.log(data[i].title);

        }; // Closes for loop

      }); // Closes getPromise.done


    }); // Closes initial get

  }; // Closes get function

  introButton.click(function(){

    resetAttr($(this));
    resetHide(introContent);

  });

  getButton.click(function(){
    // debugger;
    resetAttr($(this));
    resetHide(getContent);

    getData();
  });

  getPagination.on("click","#allSeasons",function(){
    getData();
  })

  getPagination.on("click",".seasonButton",function(){

    var seasonButton = $(this).text();
    $("#getTable td").remove();

    // console.log(seasonButton.substr(seasonButton.indexOf(" ")));

    var getPromise = $.get( "http://localhost:1337/episode?season=" +  seasonButton.substr(seasonButton.indexOf(" ")), function( data ) {

      getPromise.done(function(data){

        for (var i = 0; i < data.length; i++) {

          var goodDate = data[i].orig_air_date;

          getTable.append(
            '<tr> <td> <span class="glyphicon glyphicon-remove delete" aria-hidden="true" data-episodeID="' + data[i].id +
            '"></span> </td>' +
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

  addTable.click(function(){

    postTable.append(
      '<tr>' +
        '<td><span class="glyphicon glyphicon-plus plus" aria-hidden="true"></span></td>' +
        '<td><input type="number" class="form-control postSeason"></td>' +
        '<td><input type="number" class="form-control postEpisode"></td>' +
        '<td><input type="text" class="form-control postTitle" placeholder="Title"></td>' +
        '<td><textarea type="text" class="form-control postDescription" placeholder="Description" rows="1"></textarea></td> ' +
        '<td><input type="date" class="form-control postAir_date" placeholder="Air Date"></td>' +
      '</tr>'
    )

  });

  resetTable.click(function(){
    $("#postTable td").remove();
  });

  postTable.on("click", ".plus", function(){

    var seasonData = $(this).closest('tr').find(".postSeason").val();    // Find the input
    var episodeData = $(this).closest('tr').find(".postEpisode").val();    // Find the input
    var titleData = $(this).closest('tr').find(".postTitle").val();    // Find the input
    var descriptionData = $(this).closest('tr').find(".postDescription").val();    // Find the input
    var air_dateData = $(this).closest('tr').find(".postAir_date").val();    // Find the input

    $.ajax({
      url: 'http://localhost:1337/episode?season=' + seasonData +
      '&ep_num=' + episodeData +
      '&title=' + titleData +
      '&description=' + descriptionData +
      '&orig_air_date=' + air_dateData
      ,
      type: 'POST',
      success:  function(xhr){
        alert.append('<div class="alert alert-success alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"> ' +
        '<span aria-hidden="true">&times;</span></button>' +
        '<strong>Success!</strong> You have added your item to the API.</div>')

      },
      error: function(errorThrown ){
          alert.append('<div class="alert alert-danger alert-dismissible" role="alert"> ' +
          '<button type="button" class="close" data-dismiss="alert" aria-label="Close"> ' +
          '<span aria-hidden="true">&times;</span></button>' +
          '<strong>Warning!</strong> Error message: ' + errorThrown + '! Please check to see if you completed all required fields.</div>')
      }
    });


  });


  putButton.click(function(){

    resetAttr($(this));
    resetHide(putContent);

  });

  // What to do when the delete button is pressed
  getTable.on("click", ".delete", function(){

    var record_ID = $(this).attr('data-episodeID');

    $.ajax({
      url: 'http://localhost:1337/episode?id=' + record_ID,
      type: 'DELETE',
      success:  function(xhr) {
        getData();
      },
      error: function( jqXhr, textStatus, errorThrown ){
          console.log( errorThrown );
      }

    });

  });

})();
