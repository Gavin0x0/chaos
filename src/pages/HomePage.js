//HomePage
import { Component } from 'react';
import { Link } from "react-router-dom";
import '../styles/HomePage.css';

class HomePage extends Component {
    render() {
        return (
            <div className='full-screen-container'>
                <h1>HomePage</h1>
                <Link className='link' to="/">Back to App</Link>
            </div>
        );
    }
}

export default HomePage;