import React, { Component } from 'react';
import { Link } from 'react-router';
import Jumbotron from './Jumbotron';

import { Doughnut} from 'react-chartjs-2';

class Poll extends Component {
    constructor() {
        super();
        this.colors = [];
        this.state = {
            poll: {},
            options: [],
            data: []
        };
    }

    componentDidMount() {
        fetch('/api/polls/'+this.props.params.id).then(data => data.json()).then(json => {
            var tmp = json[0];
            var poll = { id: tmp.poll_id, title: tmp.poll_title, createDate: tmp.create_date};
            var options = [];
            json.map(function(option) {
                options.push({ id: option.id, title: option.title, clicks: option.clicks})
            });

            this.setState({ poll: poll, options: options, data: this.getData(options) });
        });
    }

    componentWillUnmount() {
        window.clearInterval(this.setStateInterval);
    }


    getData(options) {
        var data = {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
                hoverBackgroundColor: []
            }]
        }
        options.map(function(option) {
           data.labels.push(option.title);
           data.datasets[0].data.push(option.clicks);
           data.datasets[0].backgroundColor.push(this.getColor());
            data.datasets[0].hoverBackgroundColor.push(this.getColor());
        }, this);

        return data;
    }

    updateData(options) {
        var data = this.state.data;
        data.datasets[0].data = [];
        options.map(function(option) {
            data.datasets[0].data.push(option.clicks);
        }, this);

        return data;
    }

    getColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        do {
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
        } while (this.colors.indexOf(color) > -1);
        this.colors.push(color);
        return color;
    }

    handleClick(id) {
        fetch('/api/polls/option/'+id, { method: 'PUT' });
        var options = this.state.options;
        options.map(function(option) {
            if(option.id == id) option.clicks++;
        })
        this.setState({data: this.updateData(options) });
    }

    render() {
        var poll = this.state.poll;
        var options = this.state.options;
        options = options.map(function(option, index){
            return <button type="button" className="list-group-item" onClick={() => this.handleClick(option.id)} >{option.title}</button>;
        }, this);

        return (
            <div>
                <Jumbotron />
                <div className="jumbotron">
                    <h1 className="text-center">{poll.title}</h1>
                    <div className="row flex">
                        <div className="col-md-6">
                            <div className="list-group options">{options}</div>
                        </div>
                        <div className="col-md-6">
                            <Doughnut  data={this.state.data} width={3} height={2} />
                        </div>
                    </div>
                    <Link to={"/"}><a className="btn btn-lg btn-success" href="#" role="button">Back!</a></Link>
                </div>
            </div>
        );
    }
}

export default Poll;
