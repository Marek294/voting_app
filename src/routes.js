import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import Poll from './Poll';
import Polls from './Polls';
import AddPoll from './AddPoll';
import Panel from './Panel';
import Login from './Login';

const Routes = (props) => (
    <Router {...props}>
        <Route path="/" component={Polls} />
        <Route path="/polls/:id" component={Poll} />
        <Route path="/add" component={AddPoll} />
        <Route path="/login" component={Login} />
        <Route path="/panel" component={Panel} onEnter={checkAuthorization} />
        {/*<Route path="/panel/add" component={AddAdmin} onEnter={checkAuthorization} />*/}
    </Router>
);

var checkAuthorization = function() {
    fetch('/panel/admins', {
        credentials: 'include',
        headers: {
            Authorization: localStorage.getItem('Authorization')
        }
    }).then(function(response) {
        if(response.status != 200) browserHistory.push('/login');
    });
}

export default Routes;