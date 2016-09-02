
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr +','+ cityStr;
    $('.greeting').text('So, you wanna live at'+ address + '?');
    $body.append('<img class="bgimg" src="https://maps.googleapis.com/maps/api/streetview?size=600x300&location= '+address+'">');
    // YOUR CODE GOES HERE!
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
      'q' : cityStr,
      'api-key': "1fabcf73aa33430db64ff29eca489e43"
    });
    $.getJSON(url,function(data) {
      $nytHeaderElem.text('New YorkTimes Article About' + cityStr);

      articles = data.response.docs;
      for(var i = 0;i < articles.length ;i++) {
        var article = articles[i];
        $nytElem.append('<li class="article">'+
                        '<a href="' + article.web_url+'">'+article.headline.main+'</a>'
                        +'<p>'+article.snippet+'</p>'+
                          '</li>');
      };

    }).error(function(e) {
      $nytHeaderElem.text('New York Times Article Could Not be Loaded');
    });

    var wikiRequestTimeout = setTimeout(function() {
      $wikiElem.text('failed to get wikipedia resources');
    },8000);

    var wikiurl = "http://en.wikipedia.org/w/api.php?action=opensearch&search="+ cityStr +"&format=json&callback=wikiCallback";
    $.ajax({
      url :wikiurl,
      dataType:"jsonp",
      // jsonp :"callback",
      success: function(response) {
      var articleList = response[1];
      for(var i =0 ; i<articleList.length ; i++){
        var articleStr = articleList[i];
        var url = "http://en.wikipedia.org/wiki/" + articleStr;
        $wikiElem.append('<li><a href="'+url+'">'+articleStr+'</a></li>');
      };
      clearTimeout(wikiRequestTimeout);
    }
  });
    return false;
};

$('#form-container').submit(loadData);
