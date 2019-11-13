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

    // Slide position for item
    const itemClasses = `${oldIndex > index ? styles.fromLeft : styles.fromRight} ${styles.active}`;
    // Slide position for old item
    const oldItemClasses = oldIndex < index ? styles.toLeft : styles.toRight;

    console.log({itemClasses, oldItemClasses});
    return (
      <div className={styles.base}>
        <div className={styles.imagesPlaces}>
          {items.map((item, imageIndex) => {
            const classes = `
              ${styles.fullCenter}
              ${oldIndex === imageIndex && styles.animate}
              ${index === imageIndex ? styles.active : (
                imageIndex < index ? styles.leftSide : styles.rightSide
              )}
            `;

            return <img className={classes} src={item} />
          })}
        </div>
        <div className={styles.dots}>
          {items.map((item, imageIndex) => <div className={`${styles.dot} ${index === imageIndex && styles.active}`} onClick={() => this.setState({ oldIndex: index, index: imageIndex })} />)}
        </div>
      </div>
    );
  }
}

export default Carousel;