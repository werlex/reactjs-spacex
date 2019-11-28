import React from 'react';
import { Link } from 'react-router-dom';
import routes from 'utils/routes';
import styles from './style.module.scss';

export default function Navigation() {
  return (
    <div className={styles.navigation}>
      <ul>
        <li>
          <Link to={routes.HOMEPAGE}>Homepage</Link>
        </li>
        <li>
          <Link to={routes.ROCKETS}>Rockets</Link>
        </li>
        <li>
          <Link to={routes.STATISTICS}>Statistics</Link>
        </li>
      </ul>
    </div>
  );
}
