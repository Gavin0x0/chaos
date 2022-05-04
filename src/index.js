import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './pages/App';
import HomePage from './pages/HomePage';
import NFTsPage from './pages/NFTsPage';
import RigControlsPage from './pages/RigControlsPage';
import FPVControlsPage from './pages/FPVControlsPage';
import GalleryImagePage from './pages/GalleryImagePage';
import DBTestPage from './pages/DBTestPage';
import CryptoLogin from './pages/CryptoLoginPage';
import GalleryByAccount from './pages/GalleryByAccount';
import SharePage from './pages/SharePage';
import RandomTourPage from './pages/RandomTourPage';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/nft" element={<NFTsPage />} />
      <Route path="/rig" element={<RigControlsPage />} />
      <Route path="/fpv" element={<FPVControlsPage />} />
      <Route path="/gallery" element={<GalleryImagePage />} />
      <Route path="/galleryByAccount" element={<GalleryByAccount />} />
      <Route path="/dbtest" element={<DBTestPage />} />
      <Route path="/login" element={<CryptoLogin />} />
      <Route path="/share" element={<SharePage />} />
      <Route path="/random" element={<RandomTourPage />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
