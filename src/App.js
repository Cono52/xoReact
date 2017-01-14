import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './App.css';

function Square(props){
  
    const transitionOptions = {
      transitionName: "fade",
      transitionEnterTimeout: 100,
      transitionLeaveTimeout: 100,
      transitionAppear: true,
      transitionAppearTimeout: 100 
    };

    return (
      <button id={props.id} className="square" onClick={(e) => {
        props.onClick()
        e.target.className = "square flipped"
        e.target.append()
      }}>
        <ReactCSSTransitionGroup {...transitionOptions}>
          <p>{props.value}</p>
        </ReactCSSTransitionGroup>
      </button>
    );
}

class Board extends Component {

  renderSquare(i,j) {
		return <Square
			id={i+(j*3)} 
			key={i+(j*3)} value={this.props.squares[i+(j*3)]} 
			onClick={() => this.props.onClick(i+(j*3))}
		/>;
  }

  render() {	
		let rows =	[...Array(3)].map((x,j) => 
			<div key={j} className="board-row">{[...Array(3)].map((box, i) => 
				this.renderSquare(i,j))
			}</div>
		)

    return (
      <div>
				{rows}
      </div>
    );
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        coord: null
      }],
      xIsNext: true,
      stepNumber: 0
    };
  }

  makeAiMove() {
    console.log() 
  }

  handleClick(i){
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    let x = (i % 3)+1
    let y = (Math.floor(i/3))+1
    this.setState({
      history: history.concat([{
        squares: squares,
        coord: {x,y}
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
    this.makeAiMove();
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((sq, move) => {
      const desc = move ?
        'Move : (' + history[move].coord.x + "," + history[move].coord.y + ')' :
        'Game start';
      return (
        <li key={move}>
          <a href="#" onClick={(event) => {
              this.jumpTo(move)
              let old = document.getElementById("selected")
              if (old) {
                old.removeAttribute("id")
                old.removeAttribute("style")
              }
              event.target.style.cssText = "font-weight: bold"
              event.target.setAttribute("id", "selected")
            }
          }
          >{desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
			status = 'Winner: ' + winner.player;
			winner.line.forEach(x => {
				document.getElementById(x.toString()).style.cssText = "color: red"
			})
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <h2>TIC TAC TOE</h2>
        <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ul>{moves}</ul>
        </div>
      </div>
    );
  }
}

// ========================================

function calculateWinner(squares) {
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
			return {player: squares[a], line:lines[i]}
    }
  }
  return null;
}



export default App;
