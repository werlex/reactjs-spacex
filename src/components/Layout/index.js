import React, { Component } from 'react';
import Loader from 'components/Loader';
import styles from './style.module.scss';

class Layout extends Component{
  render() {
    const { loading, children } = this.props;

    return (
      <div className={styles.layout}>
        <Loader loading={loading} />
        {children}
      </div>
    );
  }
}

export default Layout;