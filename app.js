var UIController = (function(){
    var DomStrings = {
        gameBoard:'',
        tile00:'t0',
        tile01:'t1',
        tile02:'t2',
        tile03:'t3',
        tile04:'t4',
        tile05:'t5',
        tile06:'t6',
        tile07:'t7',
        tile08:'t8',
        tile09:'t9',
        tile10:'t10',
        tile11:'t11',
        tile12:'t12',
        tile13:'t13',
        tile14:'t14',
        tile15:'t15',
        score: 'scoreVal',
        newGame: '.newGame'
    };
    
    var UpdateBoard = function(tiles, score){
        var tileElement, tileVal;
        for(var i=0; i<16; i++){
            tileElement = document.querySelector("#t" + i);
            tileVal = tiles[i].Value;
            tileElement.textContent = tileVal;
            tileElement.className = "tile t" + tileVal;
        }
        
        document.getElementById(DomStrings.score).textContent = score;
    }
    
    return{
        
        DOM : DomStrings,
        
        UpdateGame: UpdateBoard
        
    }
})();

var GameController = (function(){
    
    var GenerateNewtile = function(){
        var index, tileIndex, tileValue, emptyTiles;
        
        //find index of empty tiles
        emptyTiles = GetEmptyTiles();
        
        //pick a rondom tile
        index = Math.round(Math.random() * (emptyTiles.length -1));
        tileIndex = emptyTiles[index];
        Math.random() < 0.8 ? tileValue = 2 : tileValue = 4;
        //console.log(emptyTiles.length + " emptyTiles[index] " + index + " value " + tileIndex);
        data.tiles[tileIndex].Value = tileValue;
        data.tiles[tileIndex].IsMerged = false;
    };
    
    //get empty tiles array
    function GetEmptyTiles(){
        var emptyTiles = [];
        //find index of empty tiles
        for(var i=0; i<16; i++){
            if(data.tiles[i].Value === 0){
                emptyTiles[emptyTiles.length] = i;
            }
        }
        
        return emptyTiles;
    }
    
    var Tile = function(val, Merged){
        this.Value = val;
        this.IsMerged = Merged;
    }

    //handle 1 dimension array as 2 dimensions array
    function GetTileIndex(row, column) {
        return row * 4 + column;
    }
    
    function ResetMergedTiles(){
        for(var i =0; i< data.tiles.length; i++){
            data.tiles[i].IsMerged = false;
        }
    }
    
    function IsGameover(){
        //check empty tiles
        if(GetEmptyTiles().length > 0){
            return false;
        }

        //check adjucent tiles
        var index1, index2;
        //check columns from 1 to 3
        for(var i=0; i<3; i++){//rows
            for(var j=0; j<3; j++){//columns
                index1 = GetTileIndex(i, j);
                index2 = GetTileIndex(i, j +1);
                if(data.tiles[index1].Value === data.tiles[index2].Value){
                    return false;
                }
            }
        }
        
        //check last column
        if(data.tiles[GetTileIndex(0,2)].Value === data.tiles[GetTileIndex(0,3)].Value ||
           data.tiles[GetTileIndex(1,2)].Value === data.tiles[GetTileIndex(1,3)].Value ||
           data.tiles[GetTileIndex(2,2)].Value === data.tiles[GetTileIndex(2,3)].Value ||
           data.tiles[GetTileIndex(3,2)].Value === data.tiles[GetTileIndex(3,3)].Value ){
                return false;
            }
        
       //check rows from 1 to 3
        for(var i=0; i<3; i++){//columns
            for(var j=0; j<3; j++){//rows
                index1 = GetTileIndex(j, i);
                index2 = GetTileIndex(j +1, i);
                if(data.tiles[index1].Value === data.tiles[index2].Value){
                    return false;
                }
            }
        }
        
        //check last column
        if(data.tiles[GetTileIndex(2,0)].Value === data.tiles[GetTileIndex(3,0)].Value ||
           data.tiles[GetTileIndex(2,1)].Value === data.tiles[GetTileIndex(3,1)].Value ||
           data.tiles[GetTileIndex(2,2)].Value === data.tiles[GetTileIndex(3,2)].Value ||
           data.tiles[GetTileIndex(2,3)].Value === data.tiles[GetTileIndex(3,3)].Value ){
                return false;
            }
        
        
        return true;
    }
    
    var data = {
        tiles: [],
        score: 0
    }
    
    //move and merge tiles to up direction one step
    function MoveTileUp(){
            var val, otherVal, index, otherIndex, i, j;
            
            //handling movement
            for (j = 0; j < 4; j++)//rows
            {
                for (i = 0; i < 3; i++)//columns
                {
                    index = GetTileIndex(i, j);
                    otherIndex = GetTileIndex(i + 1, j);
                    val = data.tiles[index].Value; 
                    otherVal = data.tiles[otherIndex].Value; 
                    
                    if (val === 0 && otherVal !== 0)
                    {
                        data.tiles[index].Value = otherVal;
                        data.tiles[otherIndex].Value = 0;
                        return true;
                    }
                }
            }

            //handling merge
            for (j = 0; j < 4; j++)//rows
            {
                for (i = 0; i < 3; i++)//columns
                {
                    index = GetTileIndex(i, j);
                    otherIndex = GetTileIndex(i + 1, j);
                    val = data.tiles[index].Value;
                    otherVal = data.tiles[otherIndex].Value;
                    
                    if (val !== 0 && val === otherVal
                            && data.tiles[index].IsMerged === false && data.tiles[otherIndex].IsMerged === false)
                    {
                        data.tiles[index].Value = val * 2;
                        data.tiles[otherIndex].Value = 0;
                        data.score += val * 2;
                        data.tiles[index].IsMerged = true;
                        return true;
                    }
                }
            }

            return false;
          }
    
    function MoveTileDown(){
            var val, otherVal, index, otherIndex, i, j;
            
            //handling movement
            for (j = 3; j >= 0 ; j--)//rows
            {
                for (i = 3; i > 0; i--)//columns
                {
                    index = GetTileIndex(i, j);
                    otherIndex = GetTileIndex(i - 1, j);
                    val = data.tiles[index].Value; 
                    otherVal = data.tiles[otherIndex].Value; 
                    
                    if (val === 0 && otherVal !== 0)
                    {
                        data.tiles[index].Value = otherVal;
                        data.tiles[otherIndex].Value = 0;
                        return true;
                    }
                }
            }

            //handling merge
            for (j = 3; j >= 0 ; j--)//rows
            {
                for (i = 3; i > 0; i--)//columns
                {
                    index = GetTileIndex(i, j);
                    otherIndex = GetTileIndex(i - 1, j);
                    val = data.tiles[index].Value;
                    otherVal = data.tiles[otherIndex].Value;
                    
                    if (val !== 0 && val === otherVal
                            && data.tiles[index].IsMerged === false && data.tiles[otherIndex].IsMerged === false)
                    {
                        data.tiles[index].Value = val * 2;
                        data.tiles[otherIndex].Value = 0;
                        data.score += val * 2;
                        data.tiles[index].IsMerged = true;
                        return true;
                    }
                }
            }

            return false;
          }
        
    function MoveTileLeft(){
        var val, otherVal, index, otherIndex, i, j;
        
        //handling movement
            for (i = 0; i < 4; i++)//rows
            {
                for (j = 0; j < 3; j++)//columns
                {
                    index = GetTileIndex(i, j);
                    otherIndex = GetTileIndex(i, j+1);
                    val = data.tiles[index].Value; 
                    otherVal = data.tiles[otherIndex].Value; 
                    
                    if (val === 0 && otherVal !== 0)
                    {
                        data.tiles[index].Value = otherVal;
                        data.tiles[otherIndex].Value = 0;
                        return true;
                    }
                }
            }

            //handling merge
            for (i = 0; i < 4; i++)//rows
            {
                for (j = 0; j < 3; j++)//columns
                {
                    index = GetTileIndex(i, j);
                    otherIndex = GetTileIndex(i, j+1);
                    val = data.tiles[index].Value;
                    otherVal = data.tiles[otherIndex].Value;
                    
                    if (val !== 0 && val === otherVal
                            && data.tiles[index].IsMerged === false && data.tiles[otherIndex].IsMerged === false)
                    {
                        data.tiles[index].Value = val * 2;
                        data.tiles[otherIndex].Value = 0;
                        data.score += val * 2;
                        data.tiles[index].IsMerged = true;
                        return true;
                    }
                }
            }
            return false;
        
    }
    
    function MoveTileRight(){
        var val, otherVal, index, otherIndex, i, j;
        
        //handling movement
            for (i = 3; i >= 0; i--)//rows
            {
                for (j = 3; j > 0; j--)//columns
                {
                    index = GetTileIndex(i, j);
                    otherIndex = GetTileIndex(i, j-1);
                    val = data.tiles[index].Value; 
                    otherVal = data.tiles[otherIndex].Value; 
                    
                    if (val === 0 && otherVal !== 0)
                    {
                        data.tiles[index].Value = otherVal;
                        data.tiles[otherIndex].Value = 0;
                        return true;
                    }
                }
            }

            //handling merge
            for (i = 3; i >= 0; i--)//rows
            {
                for (j = 3; j > 0; j--)//columns
                {
                    index = GetTileIndex(i, j);
                    otherIndex = GetTileIndex(i, j-1);
                    val = data.tiles[index].Value;
                    otherVal = data.tiles[otherIndex].Value;
                    
                    if (val !== 0 && val === otherVal
                            && data.tiles[index].IsMerged === false && data.tiles[otherIndex].IsMerged === false)
                    {
                        data.tiles[index].Value = val * 2;
                        data.tiles[otherIndex].Value = 0;
                        data.score += val * 2;
                        data.tiles[index].IsMerged = true;
                        return true;
                    }
                }
            }
            return false;
        
    }
    
    
    return {
        
        newGame: function(){
            //initilize all tiles
            for(var i=0; i<16; i++){
                data.tiles[i] = new Tile(0, false);    
            }

            data.score = 0;
            
            //get random tiles
            GenerateNewtile();
            GenerateNewtile();
        },    
        
        GetTilesValue : function(){
            return data.tiles;
        },

        GetScore: function(){
            return data.score;
        },

        IsGameover: IsGameover,
        
        MoveUp: function(){
            var IsUpdated = false;
        
            while(MoveTileUp()){
                IsUpdated = true;
            }
            
            //for any change, generate new tile
            if(IsUpdated){
                ResetMergedTiles();
                GenerateNewtile();
            }
            return IsUpdated;
        },
        
        MoveDown: function(){
            var IsUpdated = false;
        
            while(MoveTileDown()){
                IsUpdated = true;
            }
            
            if(IsUpdated){
                ResetMergedTiles();
                GenerateNewtile();
            }
            return IsUpdated;
        },
                
        MoveRight: function(){
            var IsUpdated = false;
        
            while(MoveTileRight()){
                IsUpdated = true;
            }
            
            if(IsUpdated){
                ResetMergedTiles();
                GenerateNewtile();
            }
            return IsUpdated;
        },
            
        MoveLeft: function(){
            var IsUpdated = false;
        
            while(MoveTileLeft()){
                IsUpdated = true;
            }
            
            if(IsUpdated){
                ResetMergedTiles();
                GenerateNewtile();
            }
            return IsUpdated;
        },
        
        testing: function(){
            console.log(data);
        }
        
    }
    
})();

var Controller = (function(UICont, GameCont){
    
    
    function HandleMovement(event){
        
        var IsUpdated = false;
            if(event.keyCode === 39 || event.which === 39){
                if(GameCont.MoveRight()){
                    IsUpdated = true;
                }           
            } else if(event.keyCode === 37 || event.which === 37){
                if(GameCont.MoveLeft()){
                    IsUpdated = true;
                }
            } else if(event.keyCode === 38 || event.which === 38){
                if(GameCont.MoveUp()){
                    IsUpdated = true;
                }
            } else if(event.keyCode === 40 || event.which === 40){
                if(GameCont.MoveDown()){
                    IsUpdated = true;
                }
            }
            
            //update UI after movement
            if(IsUpdated){
                UICont.UpdateGame(GameCont.GetTilesValue(), GameCont.GetScore());
            }
            
            if(GameCont.IsGameover()){
                document.removeEventListener('keypress', HandleMovement);
                alert("Gameover");
            }
    }
    
    function HandleNewGame(){
        
        document.addEventListener('keypress', HandleMovement);
        GameCont.newGame();
        UICont.UpdateGame(GameCont.GetTilesValue(), GameCont.GetScore());
    }
    
    function init(){
        document.querySelector(UICont.DOM.newGame).addEventListener('click', HandleNewGame);
        HandleNewGame(); 
    }
    
    return{
        init: init
    }
    
})(UIController, GameController);

Controller.init();