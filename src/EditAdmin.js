import React, { Component } from 'react';


class EditAdmin extends Component {
    constructor() {
        super();
        this.state = {
            username: ''
        };

    }

    componentDidMount() {
        fetch('/panel/admins/'+this.props.id, {
            headers: {
                Authorization: localStorage.getItem('Authorization')
            }
        }).then(data => data.json()).then(json => {
            this.setState({
                username: json.username,
                password: ''
            });
        });
    }

    handleUsernameChange(e) {
        this.setState({ username: e.target.value });
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();

        fetch('panel/admins/'+this.props.id, {
            method: 'PUT',
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
            <div className="jumbotron text-center">
                <div>
                    <form id="editForm" onSubmit={this.handleSubmit.bind(this)} >
                        <input id="username" style={{display: 'none'}} type="text" name="fakeusernameremembered" />
                        <input id="password" style={{display: 'none'}} type="password" name="fakepasswordremembered" />
                        <div className="form-group row">
                            <label for="example-text-input" className="col-sm-offset-2 col-sm-3 col-form-label">Username</label>
                            <div className="col-sm-3">
                                <input className="form-control" type="text" name="edit-username" placeholder="Username" onChange={this.handleUsernameChange.bind(this)} value={this.state.username} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="example-text-input" className="col-sm-offset-2 col-sm-3 col-form-label">New password</label>
                            <div className="col-sm-3">
                                <input className="form-control" type="password" name="edit-password" placeholder="New password" onChange={this.handlePasswordChange.bind(this)} value={this.state.password} />
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-offset-5 col-sm-2">
                                <input type="submit" className="btn btn-lg btn-success" value="Edit" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default EditAdmin;
