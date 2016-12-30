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
    
    request.onerror = function(data)
    {
        request.board.handleError(data.target.response, request.requestString);
    };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
};

MyBoard.prototype.makeRequest=function(requestString)
{
    this.getPrologRequest(requestString);
};

MyBoard.prototype.handleError=function(response, requestString)
{
    this.New();
    this.transitionView = new MyViewTransition(this.scene, "default",this.currTime, 4);
    this.newConsole(this.P1, this.P2, this.secondsElapsed.toString(), "SICSTUS closed!");  
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
        var l =  this.playsHistoric.length - 1;
        if(l >= 0)
        {
            this.playsHistoric[l]['caseP1matrix'] = this.p1case.getMatrix();
        }
    }
    else if(requestString == "p2")
    {
        this.p2case.createCaseElems(response);
        var l =  this.playsHistoric.length - 1;
        if(l >= 0)
        {
            this.playsHistoric[l]['caseP2matrix'] = this.p2case.getMatrix();
        }
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
    else if(requestString == "scoreP1")
    {
        this.newConsole(response, this.P2, this.Time, this.Log);
    }
    else if(requestString == "scoreP2")
    {
        this.newConsole(this.P1, response, this.Time, this.Log);
    }
    else if(requestString == "newhistoric")
    {
        this.createBoardHistoric(response);
    }
    else if(requestString == "p1historic")
    {
        this.createHistoricP1(response);
    }
    else if(requestString == "p2historic")
    {
        this.createHistoricP2(response);
    }
    else if(requestString == "statehistoric")
    {
        this.changeStateHistoric(response);
    }
    else if(requestString == "scorep1historic")
    {
        this.scorep1historic(response);
    }
    else if(requestString == "scorep2historic")
    {
        this.scorep2historic(response);
    }
    else if(requestString == "listofplayshistoric")
    {
        this.listofplayshistoric(response);
    }
};