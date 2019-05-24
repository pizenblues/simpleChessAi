
var init = function() {

  var validateMovement = function (fen) {
    if (game.validate_fen(fen) != true ){
      console.log("error")
    }
  };

  var onDragStart = function(source, piece, position, orientation) {
    if (piece.search(/^w/) === -1) {
      return false;
    }
  };

  var onChange = function(oldPos, newPos) {
    // console.log(board.fen())
    console.log(game.fen())
    console.log(board.position(game.fen()))
    console.log(game.validate_fen(board.fen()))
  };

  var board,
  game = new Chess();
  
  var cfg = {
    draggable: true,
    position: 'start',
    onChange: onChange,
    onDragStart: onDragStart
  };

  board = ChessBoard('board', cfg);
  $('#restart').on('click', board.start);

};
$(document).ready(init);