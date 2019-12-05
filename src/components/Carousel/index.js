import React, { Component } from 'react';
import styles from './style.module.scss';

class Carousel extends Component{
  state = {
    oldIndex: -1,
    index: 0,
  }

  render() {
    const { index, oldIndex } = this.state;
    const { items } = this.props;

    return (
      <div className={styles.base}>
        <div className={styles.imagesPlaces}>
          {items.map((item, itemIndex) => {
            const classes = `
              ${styles.fullCenter}
              ${oldIndex === itemIndex && styles.animate}
              ${index === itemIndex ? styles.active : (
                itemIndex < index ? styles.leftSide : styles.rightSide
              )}
            `;

            return <img key={itemIndex} alt="" className={classes} src={item} />
          })}
        </div>
        <div className={styles.dots}>
          {items.map((item, itemIndex) =>
            <div
              key={itemIndex}
              className={`${styles.dot} ${index === itemIndex && styles.active}`}
              onClick={() => this.setState({ oldIndex: index, index: itemIndex })}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Carousel;