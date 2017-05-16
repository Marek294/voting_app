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
            }});

        var sum = this.state.polls.map(function(poll,index){
            if(poll.id == id) return index;
            else return 0;
        });
        var index = sum.reduce((a, b) => a + b, 0);

        var pollsAfterRemove = this.state.polls;
        pollsAfterRemove.splice(index,1);

        this.setState({ polls: pollsAfterRemove });
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