import React, { Component } from 'react';
import styles from './style.module.scss';

class Carousel extends Component{
  render() {
    const { images } = this.props;

    return (
      <div className={styles.carousel}>
        <div className={styles.imagesPlaces}>
          {images.map((image) => <img className={styles.fullCenter} src={image} />)}
        </div>
        <div className={styles.dots}>

        </div>
      </div>
    );
  }
}

export default Carousel;