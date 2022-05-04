import logo from '../assets/logo.svg';
import '../styles/App.css';
import { Link } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Link
          className="App-link"
          to="/galleryByAccount"
        >
          Start
        </Link>
      </header>
    </div>
  );
}

export default App;
