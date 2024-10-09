import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import {
    handleGetAllUsersApi,
    handleCreateNewUserApi,
    handleEditUserApi,
    handleDeleteUserApi,

}
    from '../../services/userService';
import ModalCreateUser from './ModalCreateUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter'

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalCreateUser: false,
            isOpenModalEditUser: false,
            userEdit: {},
        }
    }

    async componentDidMount() {
        await this.getAllUsersFromReact();
    }

    handleAddNewUser = () => {
        this.setState({
            isOpenModalCreateUser: true,
        })
    }

    toggleCreateUserModal = () => {
        this.setState({
            isOpenModalCreateUser: !this.state.isOpenModalCreateUser
        })
    }

    toggleEditUserModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser
        })
    }

    getAllUsersFromReact = async () => {
        let response = await handleGetAllUsersApi('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            })
        }
    }

    createNewUser = async (data) => {
        try {
            let response = await handleCreateNewUserApi(data);
            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalCreateUser: false,
                })
                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            }
        } catch (e) {
            console.log(e);
        }
    }

    handleEditUser = async (user) => {
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user,
        })

    }

    doEditUser = async (user) => {
        let response = await handleEditUserApi(user);
        if (response && response.errCode !== 0) {
            alert(response.errMessage);
        } else {
            await this.getAllUsersFromReact();
            this.setState({
                isOpenModalEditUser: false,
            })
        }
    }

    handleDeleteUser = async (user) => {
        try {
            let response = await handleDeleteUserApi(user.id);
            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await this.getAllUsersFromReact();
            }
        } catch (e) {
            console.log(e);
        }
    }


    /** Lyfe cycle
     * Run component
     * 1. Run construct -> init state
     * 2. Did mount (gọi api, lấy giá trị, set state)
     * 3. Render
     * prop: properties; nested
     */


    render() {
        let arrUsers = this.state.arrUsers;
        return (
            <div className="users-container">
                <ModalCreateUser
                    isOpen={this.state.isOpenModalCreateUser}
                    toggleFromParent={this.toggleCreateUserModal}
                    createNewUser={this.createNewUser}
                />
                {
                    this.state.isOpenModalEditUser &&
                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggleFromParent={this.toggleEditUserModal}
                        currentUser={this.state.userEdit}
                        editUser={this.doEditUser}
                    />

                }

                <div className='title text-center'>Manage users</div>
                <div className='mx-1'>
                    <button
                        className='btn btn-primary px-3'
                        onClick={() => { this.handleAddNewUser() }}>
                        <i className='fas fa-plus'></i>
                        <span>Add new users</span>
                    </button>
                </div>
                <div className='users-table mt-4 mx-1'>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>#</th>
                                <th>Email</th>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Address</th>
                                <th>Action</th>
                            </tr>
                            {
                                arrUsers && arrUsers.map((item, index) => {
                                    return (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{item.email}</td>
                                            <td>{item.firstName}</td>
                                            <td>{item.lastName}</td>
                                            <td>{item.address}</td>
                                            <td>
                                                <button
                                                    className='btn-edit'
                                                    onClick={() => { this.handleEditUser(item) }}
                                                ><i className="fas fa-pencil-alt"></i></button>
                                                <button
                                                    className='btn-delete'
                                                    onClick={() => { this.handleDeleteUser(item) }}
                                                ><i className="fas fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                    </table>
                </div>
            </div >
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
