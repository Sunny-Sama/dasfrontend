import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

class About extends React.Component {
    render() {
        return (
            <Container className="mt-lg-2">
                <Row className="justify-content-md-center">
                    <h3>关于</h3>
                </Row>

                <p style={style}>&#9;大数据资源被广泛应用于企业业务和科学研究等领域，数据量的庞大和多样易造成人们对隐私信息的忽视，它们往往包含合法公民的个人信息，一旦信息泄露，将会对人身或财产造成不必要的损害。国家制定相关法律法规来约束收集个人信息的企业或部门，例如《网络安全法》，《个人信息安全规范》，《中华人民共和国个人信息保护法》等。其中，《中华人民共和国个人信息保护法》指出，个人信息是“以电子或者其他方式记录的能够单独或者与其他信息结合识别自然人个人身份的各种信息，包括但不限于自然人的姓名、出生日期、身份证件号码、个人生物识别信息、住址、电话号码等”。“… …不符合本法或其他法律、法规规定，或未经信息主体知情同意，不得收集个人信息。收集不需识别信息主体的个人信息，应当消除该信息的识别力，并不得恢复” 。由于数据量庞大，技术或是人工上的疏漏会造成对隐私数据的检测和保护不全面，从而泄露部分公民的隐私信息。</p>
                <p style={style}>&#9;数据在收集后和用于分析前，应当经过一定的方法高效地检测其是否含有隐私数据，只有符合规定的数据才能被使用，以减少个人信息泄露的可能性。为了达到这个目的，本实验室设计并实现了一个用于检测数据中隐私信息的平台，对数据中的隐私信息进行高效、高精度的匹配，并生成相关报告。报告显示数据中包含的隐私信息种类及数量，并给出准确的定位，从而提醒数据收集者或数据分析者使用的数据可能携带隐私信息，应当及时进行处理。除此之外，该平台支持用户自主设置隐私实体及其匹配规则，帮助用户高效地从数据集中检测自定义隐私实体。</p>
                <p></p>
                <div className="float-right">
                    <p style={style} >复旦大学数据分析与安全实验室</p>
                    <p style={style}>Laboratory for Data Analytics and Security</p>
                </div>


                {/*<p style={style} className="float-right"><a href="http://crypto.fudan.edu.cn/people/weili/">复旦大学数据分析与安全实验室</a></p>*/}
            </Container>
        );
    }
}

const style={
    fontSize: 'initial',
    textIndent: '2em'
}

export default About;