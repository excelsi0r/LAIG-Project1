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
    else if(requestString == "p1")
    {
        this.p1case.createCaseElems(response);
    }
    else if(requestString == "p2")
    {
        this.p2case.createCaseElems(response);
    }
    else if(requestString == "state")
    {
        this.changeState(response);
    }
    else if(requestString == "listPlays")
    {
        this.updatePlaysList(response);
    }
    else if(requestString == "p1alien")
    {
        this.updateP1Alien(response);
    }
    else if(requestString == "p2alien")
    {
        this.updateP2Alien(response);
    }
    else if(requestString == "easy")
    {
        this.computerPlayP2(response);
    }
    else if(requestString == "greedy")
    {
        this.computerPlayP2(response);
    }
    else if(requestString == "playP1greedy")
    {
        this.computerPlayP1(response);
    }
};