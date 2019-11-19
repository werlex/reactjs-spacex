import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import routes from 'utils/routes';
import Home from 'screens/Home';
import Rockets from 'screens/Rockets';
import Statistics from 'screens/Statistics';
import Navigation from 'parts/Navigation';

export default function Router(){
  return (
    <BrowserRouter>
      <Navigation />
      <Switch>
        <Route exact path={routes.HOMEPAGE} component={Home} />
        <Route exact path={routes.ROCKETS} component={Rockets} />
        <Route exact path={routes.Statistics} component={Statistics} />
      </Switch>
    </BrowserRouter>
  );
};
