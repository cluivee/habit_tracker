import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
import MyCalendar from './MyCalendar'
import reportWebVitals from './reportWebVitals';
import MUIGridExample from './MUIGridExample';
import ExampleDerivedState from './ExampleDerivedState';
import FirebaseAuthenticationComponent from './FirebaseAuthenticationComponent';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
