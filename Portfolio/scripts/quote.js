        //Ajax call to the wikiquote with using the library
         var API_URL = "http://en.wikiquote.org/w/api.php";
        function getWikiQuote() {
           
            $.ajax({
                url: API_URL,
                type: "GET",
                dataType: "jsonp",
            data: {
                format: "json",
                action: "query",
                redirects: "",
                list: "random",
                rnnamespace: "0"
                },   
            })
            .done(function(data, status, xhr) 
                {
                    processData(data, status);
                })
            .fail(
                function(xhr, status) 
                {
                    errorHandler(xhr,status);
                })
        }

        function processData(data, status) {
            console.log("Data :"+data);
            queryTitles(data.query.random[0].title, getSections, errorHandler);                         
        }



        function getSections(pageId) {
            console.log("page id :"+pageId);
            getSectionsForPage(pageId, function(sections){getQuote(pageId, sections);}, errorHandler);
        }

        function getQuote(pageId, sections){
            console.log("Sections:" + sections);
            getQuotesForSection(pageId, sections.sections[0], processQuote, log)
        }
        
        var errorHandler = function(status) {
            console.log("Error");
        }


        function log(message) {
            console.log("message :"+message);
        }

        function processQuote(data) {
            console.log(data);
            // document.getElementById("quote-text").innerHTML =
             // $("#quote-text").innerHTML= '"' + data.quotes[0] + '"'; 
             console.log($("#quote-text")[0].innerHTML);
            
            $("#quote-text").innerHTML= "somehting";
            $('#quote-author').innerHTML = "-" + data.titles;
        }




   


        function nextQuote() {
            getWikiQuote();

        }

        function previousQuote() {
            getWikiQuote();

        }

        queryTitles = function(titles, success, error) {
            $.ajax({
                url: API_URL,
                dataType: "jsonp",
                data: {
                    format: "json",
                    action: "query",
                    redirects: "",
                    titles: titles
                },

                success: function (result, status) {
                    var pages = result.query.pages;
                    var pageId = -1;
                    for (var p in pages) {
                        var page = pages[p];
                        // api can return invalid recrods, these are marked as "missing"
                        if (!("missing" in page)) {
                            pageId = page.pageid;
                            break;
                        }
                    }
                    if (pageId > 0) {
                        success(pageId);
                    } else {
                        error("No results");
                    }
                },

                error: function (xhr, result, status) {
                    error("Error processing your query");
                }
            });
        };

        getSectionsForPage = function(pageId, success, error) {
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
                // Use section 1 if there are no "1.x" sections
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


        getQuotesForSection = function(pageId, sectionIndex, success, error) {
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

                success: function (result, status) {
                    var quotes = result.parse.text["*"];
                    var quoteArray = []

                    // Find top level <li> only
                    var $lis = $(quotes).find('li:not(li li)');
                    $lis.each(function () {
                        // Remove all children that aren't <b>
                        $(this).children().remove(':not(b)');
                        var $bolds = $(this).find('b');

                        // If the section has bold text, use it.  Otherwise pull the plain text.
                        if ($bolds.length > 0) {
                            quoteArray.push($bolds.html());
                        } else {
                            quoteArray.push($(this).html());
                        }
                    });
                    success({ titles: result.parse.title, quotes: quoteArray });
                },
                error: function (xhr, result, status) {
                    error("Error getting quotes");
                }
            });
        };


        // WikiquoteApi.queryTitles("love", 
        // function(pageid){ console.log(pageid);
        //     WikiquoteApi.getSectionsForPage(pageid, 
        //         function(result){
        //             console.log(pageid, result.sections);
        //             WikiquoteApi.getQuotesForSection(pageid, result.sections,
        //             function(result){
        //                 console.log(result);
        //             })
        //         })
        //      });


        
        // function initiateCDCatalog() {
        //     var x;
        //     var i = 0;
        //     displayCDWithJQuery(i);
        // }
        /** test ajax call with local data file **/
        // function displayCDWithJQuery(i) {
        //     $.ajax({
        //         url: "data/cd_catalog.xml",
        //         type: "GET",
        //         dataType: "xml"
        //     })
        //     .done(function(result, status, xhr) {handleItemXml(result,i);})
        //     .fail(function( xhr, status, errorThrown ) {
        //     alert( "Sorry, there was a problem!" );
        //     console.log( "Error: " + errorThrown );
        //     console.log( "Status: " + status );
        //     console.dir( xhr );
        //     })
        //     .always(function(xhr,status){
        //         console.log("The reqest is complete!");
        //     })
        // }
        
        // function handleItemXml(xml, i) {
        //     //get xml data from response
        //     console.log(xml);

        //     //navigate throw xml document
        //     x = xml.getElementsByTagName("CD");
        //     document.getElementById("quote-text").innerHTML =
        //         "Title: " +
        //         x[i].getElementsByTagName("TITLE")[0].childNodes[0].nodeValue;
        //     document.getElementById("quote-author").innerHTML =
        //         "Artist: " +
        //         x[i].getElementsByTagName("ARTIST")[0].childNodes[0].nodeValue;
        // }   

        /* This is a javascript XMLHttpRequest call for learning. It is replaced by the jquery ajax.*/
        // function displayItem(i) {
        //     var xmlhttp = new XMLHttpRequest();
        //     xmlhttp.onreadystatechange = function () {
        //         if (this.readyState == 4 && this.status === 200) {
        //             handleItem(this, i);
        //         }
        //         // else 
        //         // {
        //         //     document.getElementById("quote-text").innerHTML = "Ajax failed";
        //         // }
        //     }
        //     xmlhttp.open("GET", "data/cd_catalog.xml", true);
        //     xmlhttp.send();
        // }


