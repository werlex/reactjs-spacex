import React, { Component, Fragment } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import api from 'utils/api';
import Layout from 'components/Layout';
import styles from './style.module.scss';

class Statistics extends Component{
  state = {
    loading: true,
    launches: [],
    rockets: [],
    rocketsInfo: null,
    selectedRocket: null,
  }

  componentDidMount(){
    this.initialize();
  }

  initialize = async () => {
    const rockets = await api({ path:'rockets' });
    const launches = await api({ path:'launches' });
    const rocketsInfo = {};
    rockets.forEach(rocket => {
      rocketsInfo[rocket.rocket_id] = {
        name: rocket.rocket_name,
        launchCost: this.divideByTenth(rocket.cost_per_launch, 6),
        totalSpent: 0,
        totalLaunches: 0,
      };
    });

    this.setState({
      rockets,
      rocketsInfo,
      launches,
      loading: false,
    });
  }

  divideByTenth = (number, pow) => parseFloat( number / 10 ** pow );

  convertSpentAmount = amount => amount >= 1000
    ? `$${+this.divideByTenth(amount, 3).toFixed(3)} Billions`
    : `$${+amount.toFixed(3)} Millions`

  customTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.label}>{label}</p>
          <p className={styles.description}>
            {<Fragment>
              This rocket was launched <u>{payload[0].payload.totalLaunches}</u> times.<br />
              SpaceX spent <u>{this.convertSpentAmount( payload[0].payload.totalSpent )}</u>
            </Fragment>}
          </p>
        </div>
      );
    }

    return null;
  };

  barClick = data => {
    this.setState({ selectedRocket: data.id });
  }

  constructRocketGraphData = () => {
    const { launches, rocketsInfo, selectedRocket } = this.state;
    const yearlyLaunches =
      launches
      .filter(launch => launch.rocket.rocket_id === selectedRocket)
      .reduce((prev, cur, index) => {
        const year = cur.launch_year;
        const value = [...prev[year] || [], cur];
        prev[year] = value;
        return index === 1 ? { [year] : value } : prev;
      });

    return Object.keys(yearlyLaunches).map(year => {
      return {
        name: year,
        totalLaunches: yearlyLaunches[year].length,
        totalSpent: yearlyLaunches[year].length < 2
        ? rocketsInfo[yearlyLaunches[year][0].rocket.rocket_id].launchCost
        : yearlyLaunches[year].reduce((prev, cur, index) => {
          return index === 1
            ? rocketsInfo[cur.rocket.rocket_id].launchCost
            : prev + rocketsInfo[cur.rocket.rocket_id].launchCost;
        }),
      }
    });
  }

  render() {
    const { loading, rockets, rocketsInfo, launches, selectedRocket } = this.state;
    let totalSpent = 0;
    let graphData = [];

    if(launches.length) {
      launches.forEach(launch => {
        const id = launch.rocket.rocket_id;
        const launchCost = rocketsInfo[id].launchCost;
        totalSpent += launchCost;
        rocketsInfo[id].totalSpent += launchCost;
        rocketsInfo[id].totalLaunches += 1;
      });
      console.log({launches, rocketsInfo});

      graphData = rockets.map(rocket => {
        const id = rocket.rocket_id;
        return {
          totalSpent: rocketsInfo[id].totalSpent,
          totalLaunches: rocketsInfo[id].totalLaunches,
          name: rocket.rocket_name,
          id,
        };
      });
    }

    return (
      <Layout loading={loading} className={styles.rokcetList}>
        {!loading &&
          <Fragment>
            <h1>Statistics Page</h1>
            <div className={styles.textCenter}>
              Spent total on all launches is ${this.divideByTenth(totalSpent, 3).toFixed(3)}B
              {selectedRocket && <Fragment><br /><u onClick={() => this.barClick({id: null})}>Back</u></Fragment>}
            </div>
            {graphData.length && !selectedRocket &&
              <BarChart
                width={600}
                height={400}
                data={graphData}
                className={styles.graph}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: "$ Millions", angle: -90, position: "insideLeft"}} />
                <Tooltip content={this.customTooltip} />
                <Bar dataKey="totalSpent" fill="#8884d8" className={styles.bar} onClick={this.barClick} minPointSize={3} />
              </BarChart>
            }
            {selectedRocket &&
              <BarChart
                width={600}
                height={400}
                data={this.constructRocketGraphData()}
                className={styles.graph}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: "$ Millions", angle: -90, position: "insideLeft"}} />
                <Tooltip content={this.customTooltip} />
                <Bar dataKey="totalSpent" fill="#8884d8" className={styles.bar} onClick={this.barClick} minPointSize={3} />
              </BarChart>
            }
          </Fragment>
        }
      </Layout>
    );
  }
}

export default Statistics;
