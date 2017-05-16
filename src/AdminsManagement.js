import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import EditAdmin from './EditAdmin';
import AddAdmin from './AddAdmin';

class AdminsManagement extends Component {
    constructor() {
        super();
        this.state = {
            admins: [],
            editForm: [],
            addForm: false
        };
    }

    componentDidMount() {
        fetch('/panel/admins', {
            credentials: 'include',
            headers: {
                Authorization: localStorage.getItem('Authorization')
            }
        }).then(data => data.json()).then(json => {
            this.setState({ admins: json });
        });
    }

    handleAdd() {
        this.setState({addForm: !this.state.addForm});
    }

    handleEdit(index) {
        var editForm = this.state.editForm.slice();
        editForm[index] = !editForm[index];
        this.setState({editForm});
    }

    handleRemove(id) {
        fetch('panel/admins/'+id, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('Authorization')
            }});

        var sum = this.state.admins.map(function(admin,index){
            if(admin.id == id) return index;
            else return 0;
        });
        var index = sum.reduce((a, b) => a + b, 0);

        var adminsAfterRemove = this.state.admins;
        adminsAfterRemove.splice(index,1);

        this.setState({ admins: adminsAfterRemove });
    }

    setAdmins(newAdmin) {
        var arrayAfterAdd = this.state.admins;
        arrayAfterAdd.push(newAdmin)
        this.setState({ admins: arrayAfterAdd,
                        addForm: !this.state.addForm});
    }

    editAdmin(newAdmin,index) {
        var editForm = this.state.editForm.slice();
        editForm[index] = !editForm[index];

        var arrayAfterEdit = this.state.admins;
        arrayAfterEdit.splice(index,1,newAdmin);

        this.setState({ admins: arrayAfterEdit,
            editForm: editForm});
    }

    render() {
        var admins = this.state.admins;
        admins = admins.map(function(admin,index) {
            return (
                <div className="list-group-item">
                    <span>{admin.username}</span>
                    <a className="badge" type="button" key={'remove'+index} onClick={this.handleRemove.bind(this,admin.id)}><i className="fa fa-minus-circle" aria-hidden="true"></i></a>
                    <a className="badge" type="button" key={'edit'+index} onClick={this.handleEdit.bind(this,index)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></a>
                    {this.state.editForm[index] ? <EditAdmin id={admin.id} index={index} editAdmin={ (newAdmin,index) => this.editAdmin(newAdmin,index) } /> : null }
                </div>
            );

        },this);
        return (
            <div>
                <div className="list-group">{admins}</div>
                <a className="btn btn-lg btn-success addAdminButton" type="button" onClick={this.handleAdd.bind(this)}>Add admin</a>
                {this.state.addForm ? <AddAdmin newAdmin={ newAdmin => this.setAdmins(newAdmin) }/> : null }
            </div>
        );
    }
}

export default AdminsManagement;