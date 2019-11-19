import React, { Component } from 'react';
import styles from './style.module.scss';

class Home extends Component{
  render() {
    return (
      <h1>Home Page</h1>
      <p>In this page I used reactJS and SpaceX API to show Rockets data. You can check out all <a href="">rockets</a> and <a href="">Statistics</a></p>
    );
  }
}

export default Home;
