import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DetailSpecialty.scss';

import { LANGUAGES } from "../../../utils";

import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailSpecialtyByIdApi, handleGetAllCodeApi } from '../../../services/userService';
import _ from 'lodash';


class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailSepecialty: {},
            listProvince: []
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let arrDoctorId = [];

            let res = await getDetailSpecialtyByIdApi({
                specialtyId: id,
                location: 'ALL'
            });

            let resProvince = await handleGetAllCodeApi('PROVINCE');

            let dataProvince = resProvince.data;
            let result = [];
            if (dataProvince && dataProvince.length > 0) {
                dataProvince.unshift({
                    createdAt: null,
                    updatedAt: null,
                    keyMap: 'ALL',
                    type: 'PROVINCE',
                    valueEn: 'All',
                    valueVi: 'Toàn quốc'
                })
            }

            if (res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let data = res.data;
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
                this.setState({
                    dataDetailSepecialty: res.data,
                    arrDoctorId: arrDoctorId,
                    listProvince: dataProvince
                })
            }
        }

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }

    handleOnChangeSelect = async (event) => {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let location = event.target.value;
            let arrDoctorId = [];

            let res = await getDetailSpecialtyByIdApi({
                specialtyId: id,
                location: location
            });


            if (res && res.errCode === 0) {
                let data = res.data;
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
                this.setState({
                    dataDetailSepecialty: res.data,
                    arrDoctorId: arrDoctorId,
                })
            }
        }
    }


    render() {
        let { dataDetailSepecialty, arrDoctorId, listProvince } = this.state;
        let { language } = this.props;
        return (
            <div className='detail-specialty-container'>
                <HomeHeader />
                <div className='description-specialty'>
                    {dataDetailSepecialty && !_.isEmpty(dataDetailSepecialty)
                        &&
                        <div dangerouslySetInnerHTML={{ __html: dataDetailSepecialty.descriptionHTML }} />

                    }
                </div>
                <div className='detail-specialty-body'>
                    <div className='search-sp-doctor'>
                        <select onChange={(event) => this.handleOnChangeSelect(event)}>
                            {listProvince && listProvince.length > 0 &&
                                listProvince.map((item, index) => {
                                    return (
                                        <option key={index} value={item.keyMap}>
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
