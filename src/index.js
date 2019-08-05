import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import Post from './components/Post';
import Detail from './components/Detail';
import {HashRouter as Router, Route} from 'react-router-dom';

const App = () => (
    <Router>
        <Fragment>
            <Route exact path="/"  component={Home}/>
            <Route exact path="/post"  component={Post}/>
            <Route exact path="/detail/:id"  component={Detail}/>
        </Fragment>
    </Router>
);


ReactDOM.render(<App/>, document.getElementById('root'));

