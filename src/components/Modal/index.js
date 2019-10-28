import React, { Component } from 'react';
import styles from './style.module.scss';

class Modal extends Component{
  render() {
    const { children, onClose, images } = this.props;

    return (
      <div className={styles.modalBackground}>
        <div className={styles.modal}>
          <span className={styles.close} onClick={onClose}>X</span>
          {images && (
            <div className={styles.sideLeft}>
              {images.map((image) => <img className={styles.fullCenter} src={image} />)}
            </div>
          )}
          <div className={styles.sideRight}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;