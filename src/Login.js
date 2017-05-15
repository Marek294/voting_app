import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
var ReactNotify = require('react-notify');


class Login extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: ''

        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleSubmit(e) {
        e.preventDefault();
        var self = this;
        fetch('panel/authenticate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state) }).then(function(response) {
                if(response.status == 200) return response.json();
             }).then(function(json) {
                 if(json) {
                     localStorage.setItem('Authorization',json.token);
                     browserHistory.push('/panel');
                 }
                 else
                    {
                        self.showNotification();
                        self.setState({
                            username: '',
                            password: ''
                        })
                    }
        });
    }


    handleUsernameChange(e) {
        this.setState({ username: e.target.value });
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    showNotification() {
        this.refs.notificator.error("Authentication Failure","Wrong username or password!", 4000);
    }

    render() {
        return (
            <div className="jumbotron text-center">

                <h2>Welcome in panel</h2>
                <div className="loginForm">
                    <form id="loginForm" onSubmit={this.handleSubmit} >
                        <input id="username" style={{display: 'none'}} type="text" name="fakeusernameremembered" />
                        <input id="password" style={{display: 'none'}} type="password" name="fakepasswordremembered" />
                        <div className="form-group row">
                            <label for="example-text-input" className="col-sm-offset-4 col-sm-1 col-form-label">Username</label>
                            <div className="col-sm-3">
                                <input className="form-control" name="Login-username" type="text" placeholder="Username" autoComplete="nope" onChange={this.handleUsernameChange} value={this.state.username} required />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="example-text-input" className="col-sm-offset-4 col-sm-1 col-form-label">Password</label>
                            <div className="col-sm-3">
                                <input className="form-control" type="password" name="Login-password" placeholder="Password" autoComplete="new-password" onChange={this.handlePasswordChange} value={this.state.password} required />
                            </div>
                        </div>
                        <ReactNotify ref='notificator'/>

                        <div className="form-group row" style={{marginTop: 50}}>
                            <div className="col-sm-offset-5 col-sm-2">
                                <input type="submit" className="btn btn-lg btn-success" value="Log in" />
                            </div>
                            <div className="col-sm-offset-3 col-sm-2">
                                <Link to={"/"}><a className="btn btn-lg btn-warning" href="#" role="button">Back!</a></Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;
