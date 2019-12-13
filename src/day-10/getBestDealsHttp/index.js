module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const data = context.bindings.tableBinding;
    const html = [];

    html.push("<!doctype html>");
    html.push("<html lang=\"en\">");
    html.push("<head>");
    html.push("<title>Twitter Best Deals</title>");
    html.push("<link rel=\"stylesheet\" href=\"https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\" integrity=\"sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh\" crossorigin=\"anonymous\">");
    html.push("<script src=\"https://unpkg.com/ionicons@4.5.10-0/dist/ionicons.js\"></script>");
    html.push("<style>");
    html.push("h3 { margin-bottom: 5%; }");
    html.push(".card { margin-bottom: 3%; }");
    html.push(".btn { color: white; background-color: blue; }");
    html.push("</style>");
    html.push("</head>");
    html.push("<body>");
    html.push("<div class=\"container\">");
    html.push("<h3>Twitter Best #christmasdeals</h3>");
    html.push("<div class=\"row\">");
    html.push("<div class=\"col-sm-12\">");

    data.forEach(function (tweet) {
        // context.log(tweet);
        html.push("<div class=\"card\">");
        html.push("<div class=\"card-body\">");
        html.push("<p class=\"card-text\">" + tweet.Text + "</p>");
        html.push("<a href=https://twitter.com/missscreenboo/status/" + tweet.RowKey + " class=\"btn btn-default\"><ion-icon name=\"logo-twitter\"></ion-icon> View Tweet</a>");
        html.push("</div>");
        html.push("</div>");
    });

    html.push("</div>");
    html.push("</div>");
    html.push("</div>");
    html.push("</body>");
    html.push("</html>");

    context.res = {
        status: 200,
        headers: { "Content-Type": "text/html" },
        body: html.join("\n")
    };

};