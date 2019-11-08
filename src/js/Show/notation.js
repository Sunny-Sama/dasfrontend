import React from 'react';
import '../../css/item.css';

class Notation extends React.Component{
    render() {
        return (
            <div>
                <span className="item nr">姓名</span>
                <span className="item ID">身份证号</span>
                <span className="item PASSPORT">护照号</span>
                <span className="item ns">家庭住址</span>
                <span className="item DATE">生日</span>
                <span className="item PHONE">手机号码</span>
                <span className="item DIAL">固话号码</span>
                <span className="item EMAIL">邮箱</span>
                <span className="item IP">IP地址</span>
                <span className="item DEPOSIT">借记卡号</span>
                <span className="item CREDIT">信用卡号</span>
                <span className="item CAR">车牌号</span>
            </div>
        );
    }
}

export default Notation;

