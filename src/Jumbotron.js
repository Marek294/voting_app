import React, { Component } from 'react';
import { Link } from 'react-router';

class Jumbotron extends Component {
    render() {
        return (
            <div className="jumbotron text-center">
                <h1>Select poll and vote!</h1>
                <p className="lead">Don't be shy</p>
                <Link to="/add"><a className="btn btn-lg btn-success" role="button">Add new poll!</a></Link>
            </div>
        );
    }
}

export default Jumbotron;
