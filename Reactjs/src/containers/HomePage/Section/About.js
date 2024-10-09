import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';


class About extends Component {
    render() {
        return (
            <div className='section-share section-about'>
                <div className='section-about-header'>
                    Truyền thông nói gì về BookingCare
                </div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        <iframe
                            src="https://www.youtube.com/embed/FyDQljKtWnI"
                            title="CÀ PHÊ KHỞI NGHIỆP VTV1 - BOOKINGCARE - HỆ THỐNG ĐẶT LỊCH KHÁM TRỰC TUYẾN"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                        </iframe>
                    </div>
                    <div className='content-right'>
                        <p>Trong thời điểm dịch bệnh Covid-19 đang có những diễn biến phức tạp, BookingCare hỗ trợ khách hàng đặt lịch lấy mẫu xét nghiệm Covid-19 tại cơ sở y tế/ tại nhà:&nbsp;</p>
                        <p><b>Những ai cần xét nghiệm Covid?</b></p>
                        <ul>
                            <li>Người tiếp xúc gần với bệnh nhân nhiễm Covid</li>
                            <li>Người nghi nhiễm Covid (có dấu hiệu ho, sốt, khó thở...)</li>
                            <li>Người thường xuyên di chuyển qua các địa phương có dịch bệnh</li>
                            <li>Người làm trong lĩnh vực dịch vụ, khu công nghiệp, doanh nghiệp thường xuyên tiếp xúc với cộng đồng.</li>
                            <li>Các nhóm đối tượng nguy cơ cao khác theo hướng dẫn của Sở Y tế</li>
                        </ul>
                    </div>
                </div>
            </div >
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
