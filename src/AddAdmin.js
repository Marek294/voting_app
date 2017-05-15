import React, { Component } from 'react';


class AddAdmin extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: ''
        };

    }

    handleUsernameChange(e) {
        this.setState({ username: e.target.value });
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();

        fetch('panel/admins', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('Authorization')
            },
            body: JSON.stringify(this.state) }).then(function () {
                window.location.reload();
        });
    }

    render() {
        return (
            <div className="jumbotron text-center list-group-item addAdmin">
                <div>
                    <form id="addAdminForm" onSubmit={this.handleSubmit.bind(this)} >
                        <input id="username" style={{display: 'none'}} type="text" name="fakeusernameremembered" />
                        <input id="password" style={{display: 'none'}} type="password" name="fakepasswordremembered" />
                        <div className="form-group row">
                            <label for="example-text-input" className="col-sm-offset-2 col-sm-3 col-form-label">Username</label>
                            <div className="col-sm-3">
                                <input className="form-control" type="text" name="add-admin-username" placeholder="Username" onChange={this.handleUsernameChange.bind(this)} value={this.state.username} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="example-text-input" className="col-sm-offset-2 col-sm-3 col-form-label">Password</label>
                            <div className="col-sm-3">
                                <input className="form-control" type="password" name="add-admin-password" placeholder="New password" onChange={this.handlePasswordChange.bind(this)} value={this.state.password}/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-offset-5 col-sm-2">
                                <input type="submit" className="btn btn-lg btn-success" value="Add" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default AddAdmin;
