import React, { Component } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import styles from './style.module.scss';

class Chart extends Component{
  render() {
    const { data, onClick, tooltip } = this.props;

    return (
      <BarChart
        width={600}
        height={400}
        data={data}
        className={styles.graph}
        onClick={onClick}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: "$ Millions", angle: -90, position: "insideLeft"}} />
        {tooltip && <Tooltip content={tooltip} />}
        <Bar dataKey="totalSpent" fill="#8884d8" className={styles.bar} />
      </BarChart>
    );
  }
}

export default Chart;
