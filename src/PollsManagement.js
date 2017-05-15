import React, { Component } from 'react';

class PollsManagement extends Component {
    constructor() {
        super();
        this.state = {
            polls: []
        };
    }

    componentDidMount() {
        fetch('/api/polls').then(data => data.json()).then(json => {
            this.setState({ polls: json });
        });
    }

    handleRemove(id) {
        fetch('api/polls/'+id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('Authorization')
            }}).then(function () {
            window.location.reload();
        });
    }

    render() {
        var polls = this.state.polls;
        polls = polls.map(function(poll,index) {
            return (
                <div className="list-group-item">
                    <span>{poll.poll_title}</span>
                    <a className="badge" type="button" key={'remove'+index} onClick={this.handleRemove.bind(this,poll.id)}><i className="fa fa-minus-circle" aria-hidden="true"></i></a>
                </div>
            );

        },this);
        return (
            <div>
                <div className="list-group">{polls}</div>
            </div>
        );
    }
}

export default PollsManagement;