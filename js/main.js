
var init = function() {

  var board,
  game = new Chess(),
  statusEl = $('#status'),
  fenEl = $('#fen'),
  pgnEl = $('#pgn');

  // do not pick up pieces if the game is over
  // only pick up pieces for the side to move
  var onDragStart = function(source, piece, position, orientation) {
    if (game.game_over() === true ||
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }
  };

  var onDrop = function(source, target) {
    // see if the move is legal
    var move = game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return 'movimiento ilegal';
    updateStatus();
    window.setTimeout(calculateBestMove, 250);
    // window.setTimeout(makeRandomMove, 250);
  };

  // update the board position after the piece snap 
  // for castling, en passant, pawn promotion
  var onSnapEnd = function() {
    board.position(game.fen());
  };

  var updateStatus = function() {
    var status = '';

    var moveColor = 'blanco';
    if (game.turn() === 'b') {
      moveColor = 'negro';
    }

    if (game.in_checkmate() === true) {
      status = 'se acabo el juego, ' + moveColor + '  esta en jaquemate.';
    }

    else if (game.in_draw() === true) {
      status = 'Se acabo el juego, empate';
    }

    else {
      status = ' turno de ' + moveColor;

      // check?
      if (game.in_check() === true) {
        status += ', ' + moveColor + ' esta en jaque';
      }
    }

    statusEl.html(status);
    fenEl.html(game.fen());
    pgnEl.html(game.pgn());
  };

  var evaluateBoard = function (board) {
    var totalEvaluation = 0;
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        totalEvaluation = totalEvaluation + getPieceValue(board[i][j]);
      }
    }
    return totalEvaluation;
  };

  var getPieceValue = function (piece) {
    if (piece === null) {
        return 0;
    }
    var getAbsoluteValue = function (piece) {
      if (piece.type === 'p') {
          return 10;
      } else if (piece.type === 'r') {
          return 50;
      } else if (piece.type === 'n') {
          return 30;
      } else if (piece.type === 'b') {
          return 30 ;
      } else if (piece.type === 'q') {
          return 90;
      } else if (piece.type === 'k') {
          return 900;
      }
      throw "desconocido " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w');
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
};

  var calculateBestMove = function() {
    console.log("AI")
    var possibleMoves = game.moves();
    if (possibleMoves.length === 0) {
      alert("Se acabo el juego!")
    }

    var bestMove = null;
    var bestValue = -9999;

    for (var i = 0; i < possibleMoves.length; i++) {
      var movimiento = possibleMoves[i];
      // console.log(board.position())
      var thing = game.board();
      var boardValue = -evaluateBoard(thing)
      game.undo();
      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMove = movimiento
      }
    }

    // var randomIndex = Math.floor(Math.random() * possibleMoves.length);
    game.move(bestMove);
    board.position(game.fen());
  };

  var makeRandomMove = function() {
    var possibleMoves = game.moves();
  
    // game over
    if (possibleMoves.length === 0) return;
  
    var randomIndex = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIndex]);
    board.position(game.fen());
  };

  var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  };
  board = ChessBoard('board', cfg);

  updateStatus();

  $('#restart').on('click', function() {
    board.start(false);
  });

};
$(document).ready(init);