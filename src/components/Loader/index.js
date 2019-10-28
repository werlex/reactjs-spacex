import React, { Component } from 'react';
import styles from './style.module.scss';

class Loader extends Component{
  render() {
    const { loading } = this.props;

    return (
      <div className={`${styles.loader} ${loading ? styles.loading : styles.loaded}`}>
        <div className={styles.loaderProgress} />
      </div>
    );
  }
}

export default Loader;
