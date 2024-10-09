import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { Modal } from 'reactstrap';
import { LANGUAGES, CommonUtils } from '../../../utils';
import Select from 'react-select';
import { toast } from "react-toastify";


import "./RemedyModal.scss";


class RemedyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imgBase64: ''
        }
    }

    async componentDidMount() {
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.dataModal !== prevProps.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }

    }

    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imgBase64: base64
            })
        }
    }

    handleSendRemedy = () => {
        this.props.sendRemedy(this.state);
    }

    render() {
        let { isOpenModal, closeRemedyModal, dataModal, sendRemedy } = this.props;
        return (
            <Modal
                isOpen={isOpenModal}
                // toggle={() => { this.toggle() }}
                className={'remedy-modal-container'}
                size='lg'
                centered
                backdrop={true}
            >
                <div className='remedy-modal-content'>
                    <div className='remedy-modal-header'>
                        <span className='left'>Gửi hóa đơn khám bệnh</span>
                        <span
                            className='right'
                            onClick={closeRemedyModal}
                        ><i className='fas fa-times' /></span>
                    </div>
                    <div className='remedy-modal-body'>
                        <div className='row'>
                            <div className='col-6 form group'>
                                <label>Email bệnh nhân</label>
                                <input className='form-control'
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                />
                            </div>
                            <div className='col-6 form group'>
                                <label>File đơn thuốc</label>
                                <input
                                    className='form-control-file'
                                    type='file'
                                    onChange={(event) => this.handleOnChangeImage(event)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='remedy-modal-footer'>
                        <button
                            className='btn-remedy-confirm'
                            onClick={() => this.handleSendRemedy()}
                        >
                            Gửi email
                        </button>
                        <button
                            className='btn-remedy-cancel'
                            onClick={closeRemedyModal}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
