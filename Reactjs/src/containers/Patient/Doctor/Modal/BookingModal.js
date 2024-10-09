import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { Modal } from 'reactstrap';
import * as actions from "../../../../store/actions";
import FrofileDoctor from '../ProfileDoctor';
import DatePicker from '../../../../components/Input/DatePicker';
import Select from 'react-select';
import { toast } from "react-toastify";
import { LANGUAGES } from '../../../../utils';
import { savePatientBookAppointmentApi } from '../../../../services/userService';
import moment from 'moment/moment';


import "./BookingModal.scss";


class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            // phoneNumber: '',
            email: '',
            address: '',
            // reason: '',
            // birthday: '',
            selectedGender: '',
            doctorId: '',
            timeType: '',

            genders: ''
        }
    }

    async componentDidMount() {
        this.props.getGenderStart();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.builDataGender(this.props.genders)
            })
        }
        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.builDataGender(this.props.genders)
            })
        }
        if (this.props.dataTime !== prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                this.setState({
                    doctorId: this.props.dataTime.doctorId,
                    timeType: this.props.dataTime.timeType
                })
            }
        }
    }

    builDataGender = (data) => {
        let res = [];
        let language = this.props.language;

        if (data && data.length > 0) {
            data.map(item => {
                let obj = {}
                obj.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                obj.value = item.keyMap;
                res.push(obj);
            })
        }

        return res;
    }

    showHideDetailInfor = (status) => {
        this.setState({
            isShowDetailInfor: status
        })
    }

    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    handleChangeSelect = (selectedGender) => {
        this.setState({ selectedGender });
    }

    handleConfirmBooking = async () => {
        //!data.email || !data.doctorId || !data.timeType || !data.date

        let date = new Date(this.state.birthday).getTime();
        let timeString = this.buildTimeBooking(this.props.dataTime);
        let doctorName = this.buildDoctorNameBooking(this.props.dataTime);
        let { dataTime } = this.props;

        let res = await savePatientBookAppointmentApi({
            fullName: this.state.fullName,
            // phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            // reason: this.state.reason,
            date: dataTime.date,
            selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,

            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        })

        if (res && res.errCode === 0) {
            toast.success('Booking a new appointment seccess!');
            this.props.closeBookingModal();
        } else {
            toast.error('Booking a new appointment error!')
        }
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;

        if (dataTime && !_.isEmpty(dataTime)) {
            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd : DD/MM/YYYY')
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd : DD/MM/YYYY');
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;

            return `${time} - ${date}`;
        }
        return ``
    }

    buildDoctorNameBooking = (dataTime) => {
        let { language } = this.props;

        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI ?
                `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                :
                `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;
            return name;
        }
        return ``
    }

    render() {
        let { isOpenModal, closeBookingModal, dataTime } = this.props;
        let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : '';
        return (
            <Modal
                isOpen={isOpenModal}
                // toggle={() => { this.toggle() }}
                className={'booking-modal-container'}
                size='lg'
                centered
                backdrop={true}
            >
                <div className='booking-modal-content'>
                    <div className='booking-modal-header'>
                        <span className='left'><FormattedMessage id="patient.booking-modal.title" /></span>
                        <span
                            className='right'
                            onClick={closeBookingModal}
                        ><i className='fas fa-times' /></span>
                    </div>
                    <div className='booking-modal-body'>
                        {/* {JSON.stringify(dataTime)} */}
                        <div className='doctor-infor'>
                            <FrofileDoctor
                                isShowDescriptionDoctor={false}
                                doctorId={doctorId}
                                dataTime={dataTime}
                                isShowLinkDetail={false}
                                isShowPrice={true}
                            />
                        </div>
                        <div className='row'>
                            <div className='col-6 form group'>
                                <label><FormattedMessage id="patient.booking-modal.fullName" /></label>
                                <input className='form-control'
                                    value={this.state.fullName}
                                    onChange={(event) => this.handleOnChangeInput(event, 'fullName')}
                                />
                            </div>
                            {/* <div className='col-6 form group'>
                                <label><FormattedMessage id="patient.booking-modal.phoneNumber" /></label>
                                <input className='form-control'
                                    value={this.state.phoneNumber}
                                    onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                />
                            </div> */}
                            <div className='col-6 form group'>
                                <label><FormattedMessage id="patient.booking-modal.email" /></label>
                                <input className='form-control'
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                />
                            </div>
                            <div className='col-6 form group'>
                                <label><FormattedMessage id="patient.booking-modal.address" /></label>
                                <input className='form-control'
                                    value={this.state.address}
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                />
                            </div>
                            {/* <div className='col-12 form group'>
                                <label><FormattedMessage id="patient.booking-modal.reason" /></label>
                                <input className='form-control'
                                    value={this.state.reason}
                                    onChange={(event) => this.handleOnChangeInput(event, 'reason')}
                                />
                            </div>
                            <div className='col-6 form group'>
                                <label><FormattedMessage id="patient.booking-modal.birthday" /></label>
                                <DatePicker
                                    className='form-control'
                                    onChange={this.handleOnChangeDatePicker}
                                    value={this.state.birthday}
                                />
                            </div> */}
                            <div className='col-6 form group'>
                                <label><FormattedMessage id="patient.booking-modal.gender" /></label>
                                <Select
                                    value={this.state.selectedGender}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.genders}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='booking-modal-footer'>
                        <button
                            className='btn-booking-confirm'
                            onClick={() => this.handleConfirmBooking()}
                        >
                            <FormattedMessage id="patient.booking-modal.confirm" />
                        </button>
                        <button
                            className='btn-booking-cancel'
                            onClick={closeBookingModal}
                        >
                            <FormattedMessage id="patient.booking-modal.cancel" />
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
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
