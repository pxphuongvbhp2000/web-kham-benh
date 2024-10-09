import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import DatePicker from '../../../components/Input/DatePicker';
import './ManagePatient.scss';
import { getAllPatientForDoctorApi, postSendRemedy } from '../../../services/userService';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],

            isOpenRemedyModal: false,
            dataModal: {},

            isShowLoading: false,

        }
    }

    async componentDidMount() {
        await this.getDataPatient();

    }

    getDataPatient = async () => {

        let { user } = this.props;
        let { currentDate } = this.state;
        let formatedDate = moment(new Date(currentDate)).startOf('day').valueOf();

        let res = await getAllPatientForDoctorApi({
            doctorId: user.id,
            date: formatedDate
        })

        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {
            let { user } = this.props;
            let { currentDate } = this.state;
            let formatedDate = moment(new Date(currentDate)).startOf('day').valueOf();
            await this.getDataPatient();
        })
    }

    handleBtnConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            timeType: item.timeType,
            email: item.patientData.email,
            patientName: item.patientData.firstName
        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false
        })
    }

    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        this.setState({
            isShowLoading: true
        })

        let res = await postSendRemedy({
            ...dataChild,

            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            patientName: dataModal.patientName,

            language: this.props.language,

        })

        this.setState({
            isShowLoading: false
        })

        if (res && res.errCode === 0) {
            toast.success('Send remdy success')
            await this.getDataPatient();
            this.closeRemedyModal();
        } else {
            toast.error('Somthing wrongs...')
        }
    }


    render() {
        let { dataPatient, isOpenRemedyModal, dataModal, isShowLoading } = this.state;
        let { language } = this.props;
        return (
            <>
                <LoadingOverlay
                    active={isShowLoading}
                    spinner
                    text='Loading your content...'
                >
                    <div className='manage-patient-container'>
                        <div className='m-p-title'>
                            Quản lý bệnh nhân khám bệnh
                        </div>

                        <div className='manage-patient-body row'>
                            <div className='col-6 form-group'>
                                <label>Chọn ngày bệnh</label>
                                <DatePicker
                                    className='form-control'
                                    onChange={this.handleOnChangeDatePicker}
                                    value={this.state.currentDate}
                                />
                            </div>
                            <div className='col-12'>
                                <table id="table-manage-user">
                                    <tbody>
                                        <tr>
                                            <th>#</th>
                                            <th>Thời gian</th>
                                            <th>Họ và tên</th>
                                            <th>Giới tính</th>
                                            <th>Địa chỉ</th>
                                            <th>Actions</th>
                                        </tr>
                                        {dataPatient && dataPatient.length > 0 ?
                                            dataPatient.map((item, index) => {
                                                let gender = language === LANGUAGES.VI ? item.patientData.genderData.valueVi : item.patientData.genderData.valueEn;
                                                let time = language === LANGUAGES.VI ? item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn;
                                                return (
                                                    < tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{time}</td>
                                                        <td>{item.patientData.firstName}</td>
                                                        <td>{gender}</td>
                                                        <td>{item.patientData.address}</td>
                                                        <td>
                                                            <button
                                                                className='mp-btn-confirm'
                                                                onClick={() => { this.handleBtnConfirm(item) }}
                                                            ><i className="fas fa-check"></i> Xác nhận</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            :
                                            <tr>
                                                <td colSpan={6} style={{ textAlign: 'center' }}>No data</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div >

                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        closeRemedyModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />


                </LoadingOverlay>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
