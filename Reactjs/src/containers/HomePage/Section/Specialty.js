import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getAllSpecialtiesApi } from '../../../services/userService'

import Slider from "react-slick";
import './Specialty.scss';
import { withRouter } from 'react-router';

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialties: []
        }
    }

    async componentDidMount() {
        let res = await getAllSpecialtiesApi();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialties: res.data
            })
        }
    }

    handleViewDetailSpecialty = (specialty) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${specialty.id}`)
        }
    }

    render() {
        let { dataSpecialties } = this.state;

        return (
            <div className='section-share section-specialty'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>
                            <FormattedMessage id="home-page.specialty-poplular" />
                        </span>
                        <button className='btn-section'>
                            <FormattedMessage id="home-page.more-infor" />
                        </button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {dataSpecialties && dataSpecialties.length > 0 &&
                                dataSpecialties.map((item, index) => {
                                    return (
                                        <div
                                            className='section-customize specialty-child'
                                            key={index}
                                            onClick={() => this.handleViewDetailSpecialty(item)}
                                        >
                                            <div
                                                className='bg-image section-specialty'
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            />
                                            <div className='position specialty-name'>{item.name}</div>
                                        </div>
                                    )
                                })
                            }

                        </Slider>
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
