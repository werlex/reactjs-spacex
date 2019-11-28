import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import routes from 'utils/routes';
import styles from './style.module.scss';

class Home extends Component{
  render() {
    return (
      <Fragment>
        <h1>Home Page</h1>
        <p>This page is build with ReactJS! In this page system uses SpaceX API to show data about SpaceX rockets. You can check out all in <Link to={routes.ROCKETS}>rockets</Link> and <Link to={routes.STATISTICS}>statistics</Link> pages</p>
      </Fragment>
    );
  }
}

export default Home;
