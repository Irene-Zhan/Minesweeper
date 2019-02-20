$(document).ready(() => {
  var width = 8;
  var height = 8;
  var num_mines = 10;
  let mineArray = DoubleArray(width, height);
  let positions = position_array(width,height);
  let $mines = $(".mines");
  let game_start = false;
  let marked_mine = 0;
  let checked_mine = 0;
  let game_over = false;
  let scores = [];
  let num_scores = [];
  draw_board(width,height);

//resize the mine field
  $(".submit").click((e) => {
     let a = parseInt($(".in_width").val());
     let b = parseInt($(".in_height").val());
    if(isNaN(a) == true || a < 8 || a >40 || isNaN(b) == true || b < 8 || b > 30){
      alert("please enter a number between 8 and 40 for width or a number between 8 and 30 for height");
      $(".in_width").val(width);
      $(".in_height").val(height);
    }else if($(".in_mines").val() == null || $(".in_mines").val() < 1 || $(".in_mines").val() > (width*height-1)){
      alert("there needs to be at least 1 mine, at most mine_field - 1 mines");
      $(".in_mines").val(num_mines);
    }else{
      width = parseInt($(".in_width").val());
      height = parseInt($(".in_height").val());
      num_mines = parseInt($(".in_mines").val());
      mineArray = DoubleArray(width, height);
      positions = position_array(width,height);
      draw_board(width,height)
    }
  })

//Creating Score_board
  var sb = $('<table class = score_board>');
    for(var rows = 0; rows < 6; rows++){
      var new_Row = $('<tr class = score_row>');
      for(var cols = 0; cols < 2; cols++){
        var new_Col = $('<td class = score_column>');
        if(cols == 0){
          switch(rows) {
            case 0:
            new_Col.append($("<p> Rank </p>"));
              break;
            case 1:
            new_Col.append($("<p> 1st </p>"));
                break;
            case 2:
            new_Col.append($("<p> 2nd</p>"));
                break;
            case 3:
            new_Col.append($("<p> 3rd </p>"));
                break;
            case 4:
              new_Col.append($("<p> 4th </p>"));
                break;
            case 5:
              new_Col.append($("<p> 5th </p>"));
                break;
          }
        }else{
          if(rows == 0){
            new_Col.append($("<p>Time</p>"));
          }else{
            var each_score = $("<p class = 'score'></p>");
            scores[rows-1] = each_score;
            new_Col.append(each_score);
          }
        }
      new_Row.append(new_Col);
    }
    sb.append(new_Row);
  }
  $("#high_score").append(sb);

//draw mine_field
  function draw_board(width,height){
    $(".mine_field").empty();
    var table = $('<table>');
    for(var row = 0; row < height; row++){
      var newRow = $('<tr>');
      for(var col = 0; col < width; col++){
      var newCol = $('<td>');
      newCol.attr('id',`${row}_${col}`);
      var mines = $("<button class='mines'> </button>");
      mines.attr("x",row);
      mines.attr("y",col);
      mines.attr("check_1",false);
      mines.attr("bomb",false);
      mines.attr("marked",false);
      mines.attr("adjacent_mine",0);
      mines.on("click", mine_click);
      mineArray[row][col] = mines;
      newCol.append(mines);
      newRow.append(newCol);
    }
    table.append(newRow);
  }
  $(".mine_field").append(table);
  shuffle(positions);
    let q;
    $mines = $(".mines")
    for(q=0; q<num_mines; q++){
      $.each($mines,function (){
        if($(this).attr("x") == positions[q][0] && $(this).attr("y") == positions[q][1]){
          $(this).attr("bomb",true);
        }
      })
    }
    Clear_Timer();
    Stop_Timer();
    game_start = false;
    marked_mine = 0;
    checked_mine = 0;
    game_over= false;
    $("#bombs_remain").text(num_mines);
  }

//restart a game
$("#restart").on("click", function(){
  draw_board(width,height);
})

//clock
var seconds = 0, minutes = 0,t;
function add() {
  seconds++;
  if (seconds >= 60) {
      seconds = 0;
      minutes++;
      if (minutes >= 60) {
          minutes = 0;
      }
  }
  $("h1").text((minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds));
  timer();
}
function timer() {
  t = setTimeout(add, 1000);
}
function Stop_Timer() {
  clearTimeout(t);
}
function Clear_Timer() {
  $("h1").text("00:00");
  seconds = 0; minutes = 0; hours = 0;
}

//Clicking on the mine field
function mine_click(e) {
  console.log(game_over);
  if(game_over){
    return;
  }
  //start timer
  if(!game_start){
    game_start = true;
    timer();
  }

//mark a mine
  if(e.shiftKey && $(e.currentTarget).attr("check_1") === "false"){  
    if($(e.currentTarget).attr("marked") === "false"){
      $(e.currentTarget).attr("marked","true");
      marked_mine++;
      $("#bombs_remain").text(num_mines - marked_mine);
      $(e.currentTarget).append("<i class='fas fa-flag'></i>");
      $(e.currentTarget).css("backgroud-color","gray");
    }else{
      $(e.currentTarget).attr("marked","false");
      marked_mine--;
      $("#bombs_remain").text(num_mines-marked_mine);
      $(e.currentTarget).find(".fa-flag").remove();
      $(e.currentTarget).css("background-color","white");
    } 
  }

// click on a bomb
  else if($(e.currentTarget).attr("marked") === "false" && $(e.currentTarget).attr("bomb") === "true"){
    game_over = true; 
    game_start = false;
    Stop_Timer();
    $.each($mines,function (){
      if($(this).attr("check_1") !== "true"){
        check($(this).attr("x"),$(this).attr("y"));
      }
      if($(this).attr("marked") === "true" && $(this).attr("bomb") === "false"){
        $(this).text("x");
        $(this).find(".fa-flag").remove();
        $(this).css("color","red");
        $(this).css("font-size","15px");
      }else if($(this).attr("bomb") === "true" && $(this).attr("marked") === "false"){
        $(this).append("<i class='fas fa-bomb'></i>");
        $(this).css("background-color","red");
      }
    })
  }else if($(e.currentTarget).attr("marked") === "false"){ //click on a number
    if($(e.currentTarget).attr("check_1") === "true" && $(e.currentTarget).attr("adjacent_mine") != 0){ 
      let marked_mines = 0;
      let g,h;
      let x = $(e.currentTarget).attr("x");
      let y = $(e.currentTarget).attr("y");
      for(g=0;g < 3; g++){
        for(h=0; h < 3; h++){
          if(x-1+g >=0 && y-1+h >=0 && x-1+g < height && y-1+h < width){
            if(!(g == 1 && h == 1) && mineArray[x-1+g][y-1+h].attr("marked") === "true"){
              marked_mines++;
            }
          }
        }
      }
      if($(e.currentTarget).attr("adjacent_mine") == marked_mines){
        let v,w;
        for(v=0; v < 3; v++){
          for(w=0; w < 3; w++){
            if(x-1+v >=0 && y-1+w >=0 && x-1+v < height && y-1+w <width){
              if(!(v == 1 && w == 1) && mineArray[x-1+v][y-1+w].attr("check_1") === "false" && mineArray[x-1+v][y-1+w].attr("marked") === "false"){
                mineArray[x-1+v][y-1+w].click();
              }
            }
          }
        }
      }
    }else{
        check($(e.currentTarget).attr("x"),$(e.currentTarget).attr("y"));
      }
    }
// win or lose
    if(num_mines == marked_mine && checked_mine == width*height - num_mines && game_over != true){
      game_start = false;
      Stop_Timer();
      let a = minutes*60+seconds;
      num_scores.push(a);
      num_scores.sort();
      for(var count = 0; count< num_scores.length; count++){
        let min = Math.floor(num_scores[count]/60);
        let sec = parseInt(num_scores[count]%60);
        $(scores[count]).text((min ? (min > 9 ? min : "0" + min) : "00") + ":" + (sec > 9 ? sec : "0" + sec));
      }
      alert("Congratulations! You've won the game!");
      game_over = true;
    }
   
  }

  //Calculate the number of adjacent mines
    function check(x, y){
      let adjacent_mine = 0;
      if(mineArray[x][y].attr("check_1") === "true"){
        return;
      }
      if(mineArray[x][y].attr("bomb") === "true"){
        mineArray[x][y].attr("adjacent_mine",1);
        mineArray[x][y].attr("check_1","true");
        return;
      }else{
        let n,m;
        for(n=0;n<3; n++){
          for(m=0; m<3; m++)
            if(x-1+n >=0 && y-1+m >=0 && x-1+n < height && y-1+m <width && mineArray[x-1+n][y-1+m].attr("bomb") === "true"){
              adjacent_mine++;
            }
          }
        }
      mineArray[x][y].attr("adjacent_mine",adjacent_mine);
      mineArray[x][y].css("background-color","gray")
      mineArray[x][y].attr("check_1","true");
      checked_mine++;
      if(adjacent_mine != 0){
        mineArray[x][y].text(adjacent_mine);
      }else{
        let g,h;
        for(g=0;g < 3; g++){
          for(h=0; h < 3; h++){
            if(x-1+g >=0 && y-1+h >=0 && x-1+g < height && y-1+h < width){
              if(!(g == 1 && h == 1) && mineArray[x-1+g][y-1+h].attr("check_1") === "false" && mineArray[x-1+g][y-1+h].attr("marked") === "false"){
                check(x-1+g, y-1+h);
              }
            }
          }
        }
        }
      }

  function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  }

  function DoubleArray(width, height){
    let array = [];
    let i,j;
    for(i=0; i <height; i++){
      array[i] = [];
      for(j=0; j<width; j++){
        array[i][j] = null;
      }
    }
    return array;
  }
  function position_array(width,height){
    let array = [];
    let z = 0;
    let i,j;
    for(i=0; i< height; i++){
      for(j=0; j<width; j++){
        array[z] = [i,j];
        z++;
      }
    }
    return array;
  }

})
