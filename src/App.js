import logo from './logo.svg';
import './App.css';
import { Link } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className='main-title'>
          Chaos
        </h1>
        <Link className='guide-text' to="/game">—— Click Here To Start ——</Link>
      </header>
    </div>
  );
}

export default App;
