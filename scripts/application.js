$(document).ready(function() {
  bindListeners();
})

function doStuff(snapshot) {
  console.log(snapshot.key());
}

function bindListeners() {
  tileListener();
  playerListener();
  playerSelectListener();
}

function playerSelectListener() {
  $(".player-select div").on("mouseover", function() {
    $(".namespace").html($(this).attr("id"));
  });
}

function playerListener() {
  $(".player").on("click", function(){
    if (!player1){
      player1 = $(this).attr("id");
      color = player1;
      $(this).slideUp(500);
      $(".subtitle").html("Player 2: <br><span class='namespace'>Select a player!</span>");

    } else if (!player2){
      player2 = $(this).attr("id");
      $(".subtitle").html(player1.toUpperCase() + " goes first.");
      $(".player-select").slideUp({duration: 500, done: showDraggable});
    }
  });
}

function showDraggable() {
  $(".draggable").addClass(color);
  $(".draggable").slideDown(1000);
  $(".board").show(500);
}

function tileListener() {
  $(".arrow").on("click", function(){
    var arrow = $(this).attr("id");
    clickedArrow(arrow);
  });
  $("td").on("click", function(){
    var column = $(this).attr("class");
    clickedArrow(column);
  })
}

function clickedArrow(arrow) {
  var divId = addPiece(arrow,color);
  if (divId) {
    $("#" + divId).removeClass('white');
    $("#" + divId).addClass(color);
    if (checkForWin()){
      if (winFlag){
        $("body").append("<div><img src='images/seal.jpg'></div>");
        newcolor = color
        setTimeout(clickedHelper,500)
      } else {
        alert("It's a tie! Y.Y");
        location.reload(true);
      }
    }
    changeColor();
  }
}

function clickedHelper() {
  alert(newcolor.toUpperCase() + " WINS!");
  location.reload(true);
}

$(function() {
  $(".draggable").draggable({
    helper: "clone",
    snap: ".tile",
    snapMode: "inner",
    revert: "invalid"
    });
  $(".tile").droppable({
    drop: function (event, ui) {
      var arrow = $(this).parent().attr("class");
      clickedArrow(arrow);
    }
  })
})

// BEGIN BOARD GAME LOGIC//

var player1 = "";
var player2 = "";
var color = "black";
var board = [["","","","","","",""],["","","","","","",""],["","","","","","",""],["","","","","","",""],["","","","","","",""],["","","","","","",""]];
var height = 6;
var width = 7;
var winFlag = false;

function changeColor() {
  var audioElement =  document.createElement('audio')
  audioElement.setAttribute('src','images/blop.wav')
  audioElement.play();
  $(".draggable").removeClass(color);
  if (color === player1){
    $(".subtitle").html("It's " + player2 + "'s turn!")
    color = player2;
  } else if (color === player2){
    color = player1;
    $(".subtitle").html("It's " + player1 + "'s turn!")
  }
  $(".draggable").addClass(color);
}

function addPiece(column, piece){
  if (board[0][column]){
    console.log("Cannot add a piece there");
    return false;
  }
  if (!board[5][column]){
    console.log(piece + " piece added to column " + column);
    board[5][column] = piece;
    var spaceToStr = ("5" + column.toString());
    return spaceToStr;
  }
  for (var row = 1; row < height; row ++){
    if (board[row][column]){
      console.log(piece + " piece added to column " + column);
      board[row-1][column] = piece;
      var spaceToStr = ((row-1).toString() + column);
      return spaceToStr;
    }
  }
}

function checkForWin(){
  for (var row = 0; row < height; row ++){
    for (var column = 0; column < width; column ++){
      var space = board[row][column];
      if (space){
        console.log(row + ": " + column);
        var checkRows = rowCheckMethod(space, row, column);
        var checkColumns = columnCheckMethod(space, row, column);
        var checkDiags = diagCheckMethod(space, row, column)
        if (checkRows || checkColumns || checkDiags){
          winFlag = true;
          return true;
        } else if (checkForLoss()){
          return true;
        }
      }
    }
  }
}

function rowCheckMethod(space, row, column){
  var checker = (board[row][column + 1] === space) && (board[row][column + 2] === space) && (board[row][column + 3] === space);
  // console.log(row + ": " + column);
  return checker;
}

function columnCheckMethod(space, row, column){
  if (row > 2){
    return false;
  }
  var checker = (board[row + 1][column] === space) && (board[row + 2][column] === space) && (board[row + 3][column] === space);
  return checker;
}

function diagCheckMethod(space, row, column){
  return (bckDiagCheckMethod(space, row, column) || fwdDiagCheckMethod(space, row, column));
}

function bckDiagCheckMethod(space, row, column){
  if (row > 2){
    return false
  }
  var backSlash = (board[row + 1][column + 1] === space) && (board[row + 2][column + 2] === space) && (board[row + 3][column + 3] === space);
  return backSlash;
}

function fwdDiagCheckMethod(space, row, column){
  if (row < 3){
    return false
  }
  var forwardSlash = (board[row - 1][column + 1] === space) && (board[row - 2][column + 2] === space) && (board[row - 3][column + 3] === space);
  return forwardSlash;

}

function checkForLoss(){
  if (board[0][0] && board[0][1] && board[0][2] && board[0][3]
    && board[0][4] && board[0][5] && board[0][6]){
    return true;
  } else {
    return false;
  }
}

