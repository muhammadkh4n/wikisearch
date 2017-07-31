document.addEventListener("DOMContentLoaded", init);

// Initialize after document loads.
function init(event) {

  var wiki_url = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=info%7Cextracts&generator=search&inprop=url&exsentences=3&explaintext=1&exlimit=10&exintro=1&gsrlimit=10&gsrsearch=";
  var wiki = [];

  // find element in DOM by query.
  $ = function (query) {
    return document.querySelector(query);
  };

  // get value of search field.
  window.searchVal = function (event) {
    var val = $("#search").value;
    if (val && (event.keyCode == 13 || event.type == "click")) {
      $("#search-btn").innerHTML = "<i class='fa fa-spinner'></i>";
      searchWiki(val);
    } else if (val.length <= 1 && event.keyCode == 8) {
      resetSearch();
    }

    return false;
  };

  // reset search results.
  var resetSearch = function () {
    $("#results-list").innerHTML = "";
  };

  // search the wikipedia
  var searchWiki = function (search) {
    var url = wiki_url + encodeURIComponent(search);
    fetchData(url);
  };

  // fetch json data via ajax
  var fetchData = function (url) {
    $_AJAX.get(url, function (response) {
      storeData(response);
    });
  };

  // store data in wiki array.
  var storeData = function (data) {
    $("#search-btn").innerHTML = "<i class='fa fa-search'></i>";
    // reset wiki array.
    wiki = [];
    if (!data.query) {
      $("#results-list").innerHTML =
        "<p class='alert-error'><i class='fa fa-exclamation-triangle'></i> Nothing Found!</p>";
      return;
    };
    var pages = data.query.pages;
    for (var page in pages) {
      if (pages.hasOwnProperty(page)) {
        var p = pages[page];
        var item = {};
        item.title = p.title;
        item.page_id = page;
        item.url = p.fullurl;
        item.index = p.index;
        item.description = p.extract;

        wiki.push(item);
      }
    }
    wiki = wiki.sort(function (a, b) {
      return a.index - b.index;
    });

    renderData(wiki);
  };

  // render data in view.
  var renderData = function (data) {
    var results = resultsHtml(data);
    $("#results-list").innerHTML = results;
  };

  // generate results html.
  var resultsHtml = function (results) {
    var html =  "<ul class='results'>";
    for (var i = 0; i < results.length; i++) {
      html += genResultHtml(results[i]);
    }
    html += "</ul>";
    return html;
  };

  // generate a signle result html.
  var genResultHtml = function (result) {
    var html =  "<li class='result'>";
        html +=   "<a target='_blank' href='" + result.url + "'>";
        html +=     "<h2 class='title'>" + result.title + "</h2>";
        html +=     "<div class='description'>" + result.description + "</div>";
        html +=   "</a>";
        html += "</li>";

    return html;
  };

  $("#search-btn").addEventListener("click", searchVal);
  $("#search").focus();

}
