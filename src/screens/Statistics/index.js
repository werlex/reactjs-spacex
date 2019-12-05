import React, { Component, Fragment } from 'react';
import api from 'utils/api';
import Layout from 'components/Layout';
import StatBox from './components/StatBox';
import BarChart from './components/BarChart';
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
    launches.forEach(launch => {
      const id = launch.rocket.rocket_id;
      const launchCost = rocketsInfo[id].launchCost;
      rocketsInfo[id].totalSpent += launchCost;
      rocketsInfo[id].totalLaunches += 1;
    });

    this.setState({
      rockets,
      rocketsInfo,
      launches,
      loading: false,
    });
  }

  divideByTenth = (number, pow) => parseFloat( number / 10 ** pow );

  convertSpentAmount = amount => {
    if (amount >= 1000) {
      const number = this.divideByTenth(amount, 3);
      return `$${+number.toFixed(3)} Billion${number !== 1 ? 's' : ''}`;
    } else return `$${+amount.toFixed(3)} Millions`;
  }

  customTooltip = ({ active, payload, label }) => {
    if (active) {
      const launches = payload[0].payload.totalLaunches;
      return (
        <div className={styles.tooltip}>
          <p className={styles.label}>{label}</p>
          <p className={styles.description}>
            {<Fragment>
              This rocket was launched <u>{launches}</u> time{launches !== 1 && 's'}.<br />
              SpaceX spent <u>{this.convertSpentAmount( payload[0].payload.totalSpent )}</u>
            </Fragment>}
          </p>
        </div>
      );
    }

    return null;
  };

  graphClick = payload => {
    if(payload) {
      const active = payload.activePayload;
      if (active && active.length) {
        const data = active[0].payload;
        if (!data.id || this.state.rocketsInfo[data.id].totalLaunches)
          this.setState({ selectedRocket: data.id });
        else alert("Sorry, this rocket has not been launched");
      } else if ("id" in payload) this.setState({ selectedRocket: payload.id });
    }
  }

  constructRocketGraphData = () => {
    const { launches, rocketsInfo, selectedRocket } = this.state;
    const yearlyLaunches =
      launches
      .filter(launch => launch.rocket.rocket_id === selectedRocket)
      .reduce((prev, cur, index) => {
        let returnData = index === 1 ? {} : prev;
        if (index === 1) returnData[prev.launch_year] = [prev];
        const year = cur.launch_year;
        const value = [...prev[year] || [], cur];
        returnData[year] = value;
        return returnData;
      });

    return Object.keys(yearlyLaunches).map(year => {
      return {
        name: year,
        totalLaunches: yearlyLaunches[year].length,
        totalSpent: yearlyLaunches[year].length < 2
        ? rocketsInfo[yearlyLaunches[year][0].rocket.rocket_id].launchCost
        : yearlyLaunches[year].reduce((prev, cur, index) => {
          const curRocketId = cur.rocket.rocket_id;
          return index === 1
            ? rocketsInfo[curRocketId].launchCost + rocketsInfo[prev.rocket.rocket_id].launchCost
            : prev + rocketsInfo[curRocketId].launchCost;
        }),
      }
    });
  }

  render() {
    const { loading, rockets, rocketsInfo, launches, selectedRocket } = this.state;
    let allSpentMoneyOnLaunches = 0, totalLaunches = 0, averageRocketCost = 0;
    let graphData = [];

    if(launches.length) {
      graphData = rockets.map(rocket => {
        const id = rocket.rocket_id;
        const rocketInfo = rocketsInfo[id];
        const totalSpent = rocketInfo.totalSpent;
        allSpentMoneyOnLaunches += totalSpent;
        totalLaunches += rocketInfo.totalLaunches;
        averageRocketCost += rocketInfo.launchCost;
        return {
          totalSpent,
          totalLaunches: rocketInfo.totalLaunches,
          name: rocket.rocket_name,
          id,
        };
      });
      averageRocketCost = averageRocketCost / rockets.length;
    }

    return (
      <Layout loading={loading} className={styles.rokcetList}>
        {!loading &&
          <Fragment>
            <h1>Statistics</h1>
            <div className={styles.statBoxes}>
              <StatBox label="All launches cost:" number={this.convertSpentAmount(allSpentMoneyOnLaunches)} />
              <StatBox label="Total launches:" number={totalLaunches} />
              <StatBox label="Average launch cost:" number={`$${(allSpentMoneyOnLaunches / totalLaunches).toFixed(3)}M`} />
              <StatBox label="Average Rocket launch cost:" number={`$${averageRocketCost.toFixed(3)}M`} />
            </div>
            {selectedRocket
              ? <div className={styles.back} onClick={() => this.graphClick({id: null})}>Back</div>
              : <div className={styles.textCenter}>Click on column to see yearly launches for that rocket</div>}
            {graphData.length && !selectedRocket &&
              <BarChart data={graphData} onClick={this.graphClick} tooltip={this.customTooltip} />
            }
            {selectedRocket &&
              <BarChart data={this.constructRocketGraphData()} tooltip={this.customTooltip} />
            }
          </Fragment>
        }
      </Layout>
    );
  }
}

export default Statistics;
