import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from '../../assets/logo.svg';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../utils';
import { changeLanguageApp } from '../../store/actions';
import { withRouter } from 'react-router';

class HomeHeader extends Component {

    changeLanguage = (language) => {
        //fire redux actions
        this.props.changeLanguageAppRedux(language);
    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`)
        }
    }

    render() {
        let language = this.props.language;
        return (
            <React.Fragment>
                <div className='home-header-content'>
                    <div className='left-content'>
                        <i className="fas fa-bars"></i>
                        <img
                            className='header-logo'
                            src={logo}
                            onClick={() => this.returnToHome()}
                        ></img>

                    </div>
                    <div className='center-content sticky-header'>
                        <div className='child-content'>
                            <div><b><FormattedMessage id="home-header.specialty" /></b></div>
                            <div className='subs-title'><FormattedMessage id="home-header.search-doctor" /></div>
                        </div>
                        <div className='child-content'>
                            <div><b><FormattedMessage id="home-header.health-facility" /></b></div>
                            <div className='subs-title'><FormattedMessage id="home-header.select-room" /></div>
                        </div>
                        <div className='child-content'>
                            <div><b><FormattedMessage id="home-header.doctor" /></b></div>
                            <div className='subs-title'><FormattedMessage id="home-header.select-doctor" /></div>
                        </div>
                        <div className='child-content'>
                            <div><b><FormattedMessage id="home-header.fee" /></b></div>
                            <div className='subs-title'><FormattedMessage id="home-header.check-health" /></div>
                        </div>
                    </div>
                    <div className='right-content'>
                        <div className='support'><i className="fas fa-question-circle"></i><FormattedMessage id="home-header.support" /></div>
                        <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}><span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VI</span></div>
                        <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}><span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span></div>
                    </div>
                </div>

                {this.props.isShowBanner === true &&
                    <div className='home-header-banner' >
                        <div className='content-up'>
                            <div className='title1'><FormattedMessage id="home-header.medical-flaform" /></div>
                            <div className='title2'><FormattedMessage id="home-header.health-care" /></div>
                            <div className='search'>
                                <i className='fas fa-search'></i>
                                <input type='text' placeholder='Tìm kiếm'></input>
                            </div>
                        </div>

                        <div className='content-down'>
                            <div className='options'>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-hospital'></i></div>
                                    <div className='text-child'><FormattedMessage id="home-header.specialized-examination" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-mobile-alt'></i></div>
                                    <div className='text-child'><FormattedMessage id="home-header.remote-examination" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-procedures'></i></div>
                                    <div className='text-child'><FormattedMessage id="home-header.general-examination" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-flask'></i></div>
                                    <div className='text-child'><FormattedMessage id="home-header.medical-test" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-user-md'></i></div>
                                    <div className='text-child'><FormattedMessage id="home-header.mental-health" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-briefcase-medical"></i></div>
                                    <div className='text-child'><FormattedMessage id="home-header.dental-examination" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
