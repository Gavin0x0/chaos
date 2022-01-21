import React from "react";
import "../css/gamePage.css";
//return a square with value
function Square(props) {
  return (
    <button className="square" onClick={props.onClick} key={props.value}>
      {props.value}
    </button>
  );
}
// calculate winner by checking rows, columns and diagonals by fixed rules
function calculateWinner(squares) {
  //rules
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
//calculate location of each move
function calculateLocation(i) {
  const row = Math.floor(i / 3) + 1;
  const column = (i % 3) + 1;
  return "(" + row + "," + column + ")";
}
//return a 3x3 array of squares
function Board(props) {
  const rows = 3;
  const cols = 3;
  function renderEachSquare(i) {
    return (
      <Square
        key={i}
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />
    );
  }
  //return a row of squares
  function renderSquaresRow(r) {
    const column = Array.from(Array(rows), (x, i) => r * rows + i);
    console.log(column, r);
    const rowItems = column.map((i) => renderEachSquare(i));
    return (
      <div key={r} className="board-row">
        {rowItems}
      </div>
    );
  }
  //return 3 rows of squares
  const allItems = Array(cols)
    .fill(0)
    .map((x, i) => renderSquaresRow(i));
  return <div>{allItems}</div>;
}

class Game extends React.Component {
  //constructor the game component
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      curLocation: "",
      xIsNext: true,
    };
  }
  //handle the click event
  handleClick(i) {
    //change history array clip by stepNumber
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "❌" : "⭕️";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: calculateLocation(i),
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const status = winner
      ? "Winner is : " + winner
      : "Next player : " + (this.state.xIsNext ? "❌" : "⭕️");
    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" + move + " " + step.location
        : "Go to game start";
      return (
        <li
          key={move}
          className={'moves-record-li '+(this.state.stepNumber === move ? "text-bold" : "")}
        >
          <button
            className={'moves-record-buttons '+(this.state.stepNumber === move ? "text-bold" : "")}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });
    return (
      <div className="game">
        <div className="game-board">
          <div className="status-text">{status}</div>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <ol className="moves-record-ol">{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================
export default Game;
