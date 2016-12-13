$(document).ready(function() {

  var quote = "How you play, is how you'll be remembered. Go Hard, follow your heart or be forgotten.";
  var author = "-Keshia Chante";
  var tweet = "";

  function quoteReady(newQuote) {
    console.log(newQuote);
    quote = newQuote.quote.replace(/<(?:.|\n)*?>/gm, '');
    author = newQuote.titles.replace(/<(?:.|\n)*?>/gm, '');
    tweet = quote.length + author.length <= 136 ? encodeURIComponent('"' + quote + '" -' + author) : encodeURIComponent('"' + quote.substring(0, 133-author.length)+'..." -'+author);
    if (quote && author) {
       $('#quote').replaceWith('<p id="quote" class="left-align">"' + quote + '"</p>');
       $('#author').replaceWith('<p id="author" class="right-align">-' + author + "</p>");
       $('.twitter-share-button').attr("href", "https://twitter.com/intent/tweet?text=" + tweet);
    }
  }
  
  $("#getquote").click(function() {
    WikiquoteApi.queryRandomTitle(
      function(title) {
      WikiquoteApi.getRandomQuote(title, function(newQuote) {
        quoteReady(newQuote);
      }
    );},
    function(msg) {
      console.log(msg);
    });
  });
});



//
// WikiquoteApi thanks to Nate Tyler. https://github.com/natetyler/wikiquotes-api
//

var WikiquoteApi = (function() {

  var wqa = {};

  var API_URL = "https://en.wikiquote.org/w/api.php";

  wqa.queryTitles = function(titles, success, error) {
    $.ajax({
      url: API_URL,
      dataType: "jsonp",
      data: {
        format: "json",
        action: "query",
        redirects: "",
        titles: titles
      },

      success: function(result, status) {
        var pages = result.query.pages;
        var pageId = -1;
        for(var p in pages) {
          var page = pages[p];
          if(!("missing" in page)) {
            pageId = page.pageid;
            break;
          }
        }
        if(pageId > 0) {
          success(pageId);
        } else {
          error("No results");
        }
      },

      error: function(xhr, result, status){
        error("Error processing your query");
      }
    });
  };

  wqa.queryRandomTitle = function(success, error) {
    $.ajax({
      url: API_URL,
      dataType: "jsonp",
      data: {
        format: "json",
        action: "query",
        redirects: "",
        list: "random",
        rnnamespace: "0"
      },

      success: function(result, status) {
        var title = result.query.random[0].title;
        if(title !== undefined) {
          success(title);
        } else {
          error("No results");
        }
      },

      error: function(xhr, result, status){
        error("Error processing your query");
      }
    });
  };

  wqa.getSectionsForPage = function(pageId, success, error) {
    $.ajax({
      url: API_URL,
      dataType: "jsonp",
      data: {
        format: "json",
        action: "parse",
        prop: "sections",
        pageid: pageId
      },

      success: function(result, status){
        var sectionArray = [];
        var sections = result.parse.sections;
        for(var s in sections) {
          var splitNum = sections[s].number.split('.');
          if(splitNum.length > 1 && splitNum[0] === "1") {
            sectionArray.push(sections[s].index);
          }
        }
        if(sectionArray.length === 0) {
          sectionArray.push("1");
        }
        success({ titles: result.parse.title, sections: sectionArray });
      },
      error: function(xhr, result, status){
        error("Error getting sections");
      }
    });
  };

  wqa.getQuotesForSection = function(pageId, sectionIndex, success, error) {
    $.ajax({
      url: API_URL,
      dataType: "jsonp",
      data: {
        format: "json",
        action: "parse",
        noimages: "",
        pageid: pageId,
        section: sectionIndex
      },

      success: function(result, status){
        var quotes = result.parse.text["*"];
        var quoteArray = [];

        var $lis = $(quotes).find('li:not(li li)');
        $lis.each(function() {
          $(this).children().remove(':not(b)');
          var $bolds = $(this).find('b');

          if($bolds.length > 0) {
            quoteArray.push($bolds.html());
          } else {
            quoteArray.push($(this).html());
          }
        });
        success({ titles: result.parse.title, quotes: quoteArray });
      },
      error: function(xhr, result, status){
        error("Error getting quotes");
      }
    });
  };

  wqa.openSearch = function(titles, success, error) {
    $.ajax({
      url: API_URL,
      dataType: "jsonp",
      data: {
        format: "json",
        action: "opensearch",
        namespace: 0,
        suggest: "",
        search: titles
      },

      success: function(result, status){
        success(result[1]);
      },
      error: function(xhr, result, status){
        error("Error with opensearch for " + titles);
      }
    });
  };

  wqa.getRandomQuote = function(titles, success, error) {

    var errorFunction = function(msg) {
      error(msg);
    };

    var chooseQuote = function(quotes) {
      var randomNum = Math.floor(Math.random()*quotes.quotes.length);
      success(
         { titles: quotes.titles, quote: quotes.quotes[randomNum] }
      );
    };

    var getQuotes = function(pageId, sections) {
      var randomNum = Math.floor(Math.random()*sections.sections.length);
      wqa.getQuotesForSection(pageId, sections.sections[randomNum], chooseQuote, errorFunction);
    };

    var getSections = function(pageId) {
      wqa.getSectionsForPage(pageId, function(sections) { getQuotes(pageId, sections); }, errorFunction);
    };

    wqa.queryTitles(titles, getSections, errorFunction);
  };

  wqa.getCompletelyRandomQuote = function(success, error) {
      wqa.queryRandomTitle(function(title) {
          wqa.getRandomQuote(title, success, error);
      }, error);
  };

  wqa.capitalizeString = function(input) {
    var inputArray = input.split(' ');
    var output = [];
    for(s in inputArray) {
      output.push(inputArray[s].charAt(0).toUpperCase() + inputArray[s].slice(1));
    }
    return output.join(' ');
  };

  return wqa;
}());
