MyBoard.prototype.getPrologRequest=function(requestString)
{
    var requestPort = 8081
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

    request.board = this;
    request.requestString = requestString;

    request.onload = function(data)
    {
        request.board.handleReply(data.target.response, request.requestString);
    };
    
    request.onerror = function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
};

MyBoard.prototype.makeRequest=function(requestString)
{
    this.getPrologRequest(requestString);
};

MyBoard.prototype.handleReply=function(response, requestString)
{
    if(requestString == "new")
    {
        this.createBoardElems(response);
    }
};