import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';

import './ManageDoctor.scss';

import { CRUD_ACTIONS, LANGUAGES } from '../../../utils';

import Select from 'react-select';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

import { getDetailInforDoctorApi } from '../../../services/userService';
import _ from 'lodash';

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // save markdown
            contentMarkdown: '',
            contentHTML: '',

            // save doctor infor
            description: '',

            allDoctors: [],
            allPrices: [],
            allPayments: [],
            allProvinces: [],
            allSpecialty: [],
            allClinic: [],

            selectedDoctor: {},
            selectedPrice: {},
            selectedPayment: {},
            selectedProvince: {},
            selectedSpecialty: {},
            selectedClinic: {},
            nameClinic: '',
            addressClinic: '',
            note: '',
            specialtyId: '',
            clinicId: '',


            hasOldData: false
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctorsStart();
        this.props.fetchRequiredDoctorInforStart();
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                })
            }
            if (type === 'PRICE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            if (type === 'PAYMENT' || type === 'PROVINCE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            if (type === 'SPECIALTY' || type === 'CLINIC') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                })
            }
        }

        return result;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let doctorsData = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            this.setState({
                allDoctors: doctorsData
            })
        }

        if (prevProps.language !== this.props.language) {
            let doctorsData = this.buildDataInputSelect(this.props.allDoctors, 'USERS');

            let { resPrice, resPayment, resProvince } = this.props.allRequiredDoctorInfor;

            let priceData = this.buildDataInputSelect(resPrice, 'PRICE');
            let paymentData = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let provinceData = this.buildDataInputSelect(resProvince, 'PROVINCE');
            this.setState({
                allDoctors: doctorsData,
                allPrices: priceData,
                allPayments: paymentData,
                allProvinces: provinceData
            })
        }

        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resPrice, resPayment, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfor;

            let priceData = this.buildDataInputSelect(resPrice, 'PRICE');
            let paymentData = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let provinceData = this.buildDataInputSelect(resProvince, 'PROVINCE');
            let specialtyData = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
            let clinicData = this.buildDataInputSelect(resClinic, 'CLINIC');

            this.setState({
                allPrices: priceData,
                allPayments: paymentData,
                allProvinces: provinceData,
                allSpecialty: specialtyData,
                allClinic: clinicData
            })
        }
    }



    handleChangeSelect = async (selectedOption) => {
        this.setState({
            selectedDoctor: selectedOption
        });

        let res = await getDetailInforDoctorApi(selectedOption.value);
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;

            let priceId = '', provinceId = '', paymentId = '', specialtyId = '', clinicId = '',
                addressClinic = '', nameClinic = '', note = '',
                selectedPrice = '', selectedPayment = '', selectedProvince = '',
                selectedSpecialty = '', selectedClinic = '';

            let { allPrices, allPayments, allProvinces, allSpecialty, allClinic } = this.state;



            if (res.data.Doctor_Infor) {
                priceId = res.data.Doctor_Infor.priceId;
                provinceId = res.data.Doctor_Infor.provinceId;
                paymentId = res.data.Doctor_Infor.paymentId;
                addressClinic = res.data.Doctor_Infor.addressClinic;
                nameClinic = res.data.Doctor_Infor.nameClinic;
                note = res.data.Doctor_Infor.note;
                specialtyId = res.data.Doctor_Infor.specialtyId;
                clinicId = res.data.Doctor_Infor.clinicId;

                selectedPrice = allPrices.find(item => {
                    return item && item.value === priceId
                })

                selectedPayment = allPayments.find(item => {
                    return item && item.value === paymentId
                })

                selectedProvince = allProvinces.find(item => {
                    return item && item.value === provinceId
                })

                selectedSpecialty = allSpecialty.find(item => {
                    return item && item.value === specialtyId
                })

                selectedClinic = allClinic.find(item => {
                    return item && item.value === clinicId
                })
            }

            this.setState({
                contentMarkdown: markdown.contentMarkdown,
                contentHTML: markdown.contentHTML,
                description: markdown.description,
                hasOldData: true,
                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic,
                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note
            })
        } else {
            this.setState({
                contentMarkdown: '',
                contentHTML: '',
                description: '',
                hasOldData: false,
                selectedPrice: '',
                selectedPayment: '',
                selectedProvince: '',
                selectedSpecialty: '',
                selectedClinic: '',
                addressClinic: '',
                nameClinic: '',
                note: ''
            })
        }
    };

    handleChangeSelectDoctorInfor = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };

        stateCopy[stateName] = selectedOption;

        this.setState({
            ...stateCopy
        })

    }

    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state }
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        })
    }

    handleSaveContentMarkdown = () => {
        let { hasOldData } = this.state;
        this.props.saveDetailDoctorsStart({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedDoctor.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            selectedSpecialty: this.state.selectedSpecialty.value,
            selectedClinic: this.state.selectedClinic.value,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note
        });
    }

    render() {
        let { hasOldData } = this.state;
        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>
                    <FormattedMessage id="admin.manage-doctor.title" />
                </div>
                <div className='more-infor'>
                    <div className='content-left form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-doctor.select-doctor" />
                        </label>
                        <Select
                            value={!_.isEmpty(this.state.selectedDoctor) ? this.state.selectedDoctor : null}
                            onChange={this.handleChangeSelect}
                            options={this.state.allDoctors}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                        />
                    </div>
                    <div className='content-right'>
                        <label><FormattedMessage id="admin.manage-doctor.intro" /></label>
                        <textarea
                            className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'description')}
                            value={this.state.description}
                        ></textarea>
                    </div>
                </div>

                <div className='more-infor-extra row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.price" /></label>
                        <Select
                            value={!_.isEmpty(this.state.selectedPrice) ? this.state.selectedPrice : null}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.allPrices}
                            placeholder={<FormattedMessage id="admin.manage-doctor.price" />}
                            name="selectedPrice"
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.payment" /></label>
                        <Select
                            value={!_.isEmpty(this.state.selectedPayment) ? this.state.selectedPayment : null}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.allPayments}
                            placeholder={<FormattedMessage id="admin.manage-doctor.payment" />}
                            name="selectedPayment"
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.province" /></label>
                        <Select
                            value={!_.isEmpty(this.state.selectedProvince) ? this.state.selectedProvince : null}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.allProvinces}
                            placeholder={<FormattedMessage id="admin.manage-doctor.province" />}
                            name="selectedProvince"
                        />
                    </div><div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.name-clinic" /></label>
                        <input
                            className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'nameClinic')}
                            value={this.state.nameClinic}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.address-clinic" /></label>
                        <input
                            className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'addressClinic')}
                            value={this.state.addressClinic}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.note" /></label>
                        <input
                            className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'note')}
                            value={this.state.note}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.specialty" /></label>
                        <Select
                            value={!_.isEmpty(this.state.selectedSpecialty) ? this.state.selectedSpecialty : null}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.allSpecialty}
                            placeholder={<FormattedMessage id="admin.manage-doctor.specialty" />}
                            name="selectedSpecialty"
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.clinic" /></label>
                        <Select
                            value={!_.isEmpty(this.state.selectedClinic) ? this.state.selectedClinic : null}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.allClinic}
                            placeholder={<FormattedMessage id="admin.manage-doctor.clinic" />}
                            name="selectedClinic"
                        />
                    </div>
                </div>

                <div className='manage-doctor-editor'>
                    <MdEditor
                        style={{ height: '300px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <button
                    className={hasOldData === true ? 'save-content-doctor' : 'create-content-doctor'}
                    onClick={() => this.handleSaveContentMarkdown()}
                >
                    {hasOldData === true ?
                        <span><FormattedMessage id="admin.manage-doctor.save" /></span>
                        :
                        <span><FormattedMessage id="admin.manage-doctor.add" /></span>
                    }
                </button>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsStart: () => dispatch(actions.fetchAllDoctorsStart()),
        fetchRequiredDoctorInforStart: () => dispatch(actions.fetchRequiredDoctorInforStart()),
        saveDetailDoctorsStart: (data) => dispatch(actions.saveDetailDoctorsStart(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
