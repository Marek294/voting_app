import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import AdminsManagement from './AdminsManagement';
import PollsManagement from './PollsManagement';

class Panel extends Component {
    constructor() {
        super();
        this.state = {
            token: "",
            showAdmins: false,
            showPolls: false
        };

    }

    handleLogout() {
        localStorage.removeItem('Authorization');
        browserHistory.push('/login');
    }

    handleShowAdmins() {
        var showAdmins = this.state.showAdmins;
        showAdmins = !showAdmins;

        var showPolls = false;

        this.setState({
            showAdmins: showAdmins,
            showPolls: showPolls
        });
    }

    handleShowPolls() {
        var showPolls = this.state.showPolls;
        showPolls = !showPolls;

        var showAdmins = false;

        this.setState({
            showAdmins: showAdmins,
            showPolls: showPolls
        });
    }

    render() {
        return (
            <div>
                <div className="jumbotron row">
                    <div className="col-md-3">
                        <div className="list-group">
                            <button type="button" className="list-group-item" onClick={this.handleShowAdmins.bind(this)}>Administrators</button>
                            <button type="button" className="list-group-item" onClick={this.handleShowPolls.bind(this)}>Polls</button>
                        </div>
                    </div>
                    <div className="col-md-9">
                        {this.state.showAdmins ? <AdminsManagement /> : null }
                        {this.state.showPolls ? <PollsManagement /> : null }
                    </div>
                </div>
                <a className="btn btn-sm btn-danger" role="button" onClick={this.handleLogout}>Logout</a>
            </div>
        );
    }
}

export default Panel;