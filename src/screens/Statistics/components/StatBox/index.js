import React, { Component } from 'react';
import styles from './style.module.scss';

class StatBox extends Component{
  render() {
    const { number, label } = this.props;

    return (
      <div className={styles.box}>
        <div className={styles.label}>{label}</div>
        <div className={styles.number}>{number}</div>
      </div>
    );
  }
}

export default StatBox;
