import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getAllClinicApi } from '../../../services/userService'

import Slider from "react-slick";
import { withRouter } from 'react-router';
import './MedicalFacility.scss'


class MedicalFacility extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataClinics: []
        }
    }

    async componentDidMount() {
        let res = await getAllClinicApi();
        if (res && res.errCode === 0) {
            this.setState({
                dataClinics: res.data
            })
        }
    }

    handleViewDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`)
        }
    }

    render() {

        let { dataClinics } = this.state;
        return (
            <div> <div className='section-share section-medical-facility'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>Cơ sở y tế nổi bật</span>
                        <button className='btn-section'>Tìm kiếm</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {dataClinics && dataClinics.length > 0 &&
                                dataClinics.map((item, index) => {
                                    return (
                                        <div
                                            className='section-customize medical-facility-child'
                                            key={index}
                                            onClick={() => this.handleViewDetailClinic(item)}
                                        >
                                            <div
                                                className='bg-image section-medical-facility '
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            />
                                            <div className='position medical-facility-name'>{item.name}</div>
                                        </div>
                                    )
                                })
                            }

                        </Slider>

                    </div>
                </div>
            </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
