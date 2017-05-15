import React, { Component } from 'react';
import { Link } from 'react-router';
import Jumbotron from './Jumbotron';

class Polls extends Component {
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

    render() {
        var polls = this.state.polls;

        polls = polls.map(function(poll,index) {
            return (
                <Link to={"/polls/"+poll.id} ><a key={index} className="list-group-item">{poll.poll_title}</a></Link>
            );

        });
        return (
            <div>
                <Jumbotron />
                <div className="jumbotron">
                    <div className="list-group">{polls}</div>
                </div>
                <Link to="/panel"><a className="btn btn-sm btn-danger" role="button">Panel</a></Link>
            </div>
        );
    }
}

export default Polls;
