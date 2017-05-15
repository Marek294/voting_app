import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import Jumbotron from './Jumbotron';

class AddPoll extends Component {
    constructor() {
        super();
        this.state = {
            numberOfOptions: 2,
            poll_title: '',
            options: []

        };

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        var sendObject = {}
        sendObject.poll_title = this.state.poll_title;
        sendObject.options = [];
        this.state.options.map(function (option,index) {
           sendObject.options.push({title: option});
        });

        fetch('api/polls', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sendObject) }).then(function () {
                browserHistory.push("/");
        });

        //console.log(JSON.stringify(sendObject));
    }

    handleTitleChange(e) {
        this.setState({ poll_title: e.target.value });
    }

    handleChange(index, e) {
        var options = this.state.options.slice();
        options[index] = e.target.value;
        this.setState({options});
    }

    handleClick() {
        var numberOfOptions = this.state.numberOfOptions+1;
        this.setState({ numberOfOptions: numberOfOptions });
    }

    render() {
        return (
            <div>
                <Jumbotron />
                <div className="jumbotron">
                    <form onSubmit={this.handleSubmit} >
                        <div className="form-group row">
                            <label for="example-text-input" className="col-sm-2 col-form-label">Title</label>
                            <div className="col-sm-10">
                                <input className="form-control" type="text" id="example-text-input" placeholder="Title" onChange={this.handleTitleChange} value={this.state.poll_title} required />
                            </div>
                        </div>
                        {Array.apply(null, Array(this.state.numberOfOptions)).map(function(item, index) {
                            var optionString = "Option" + (index+1);
                            return (
                                <div className="form-group row">
                                    <label for="example-text-input" className="col-sm-2 col-form-label">{optionString}</label>
                                    <div className="col-sm-10">
                                        <input className="form-control" type="text" id="example-text-input" placeholder={optionString} value={this.state.options[index] || ''} onChange={this.handleChange.bind(this,index)} required />
                                    </div>
                                </div>
                            );
                        },this)}
                        <div className="form-group row">
                        <button className="btn btn-info" type="button" onClick={() => this.handleClick()} >Add option</button>
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-offset-2 col-sm-2">
                                <input type="submit" className="btn btn-lg btn-success" value="Submit" />
                            </div>
                            <div className="col-sm-offset-6 col-sm-2">
                                <Link to={"/"}><a className="btn btn-lg btn-warning" href="#" role="button">Back!</a></Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default AddPoll;