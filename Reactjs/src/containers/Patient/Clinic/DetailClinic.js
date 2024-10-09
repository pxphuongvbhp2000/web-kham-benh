import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DetailClinic.scss';

import { LANGUAGES } from "../../../utils";

import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailClinicByIdApi, handleGetAllCodeApi } from '../../../services/userService';
import _, { size } from 'lodash';


class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailClinic: {}
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let arrDoctorId = [];

            let res = await getDetailClinicByIdApi({
                clinicId: id
            });

            if (res && res.errCode === 0) {
                let data = res.data;
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorClinic;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorId: arrDoctorId
                })
            }
        }

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }


    render() {
        let { dataDetailClinic, arrDoctorId } = this.state;
        console.log('check', dataDetailClinic)
        let { language } = this.props;
        return (
            <div className='detail-clinic-container'>
                <HomeHeader />
                <div className='description-clinic'>
                    {dataDetailClinic && !_.isEmpty(dataDetailClinic)
                        &&
                        <>
                            <div
                                style={{
                                    'font-size': '20px',
                                    'font-weight': '600',
                                    'color': '#0071ba'
                                }}
                            >
                                {dataDetailClinic.name}
                            </div>
                            <div
                                style={{
                                    'font-size': '15px',
                                    'font-weight': '550',
                                    'color': '#c94052',
                                    'padding': '5px',
                                    'margin-bottom': '5px'
                                }}
                            >
                                Địa chỉ: {dataDetailClinic.address}
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.descriptionHTML }} />
                        </>

                    }
                </div>
                <div className='detail-clinic-body'>

                    <div>
                        {
                            arrDoctorId && arrDoctorId.length > 0 && arrDoctorId.map((item, index) => {
                                return (
                                    <div className='each-doctor' key={index}>
                                        <div className='dt-content-left'>
                                            <div className='profile-doctor'>
                                                <ProfileDoctor
                                                    isShowDescriptionDoctor={true}
                                                    doctorId={item}
                                                    isShowLinkDetail={true}
                                                    isShowPrice={false}
                                                />
                                            </div>
                                        </div>
                                        <div className='dt-content-right'>
                                            <div className='doctor-schedule'>
                                                <DoctorSchedule
                                                    doctorIdFromParent={item}
                                                    key={index}
                                                />
                                            </div>
                                            <div className='doctor-extra-infor'>
                                                <DoctorExtraInfor
                                                    doctorIdFromParent={item}
                                                    key={index}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
