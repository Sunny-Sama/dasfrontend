import React from 'react';
import '../../css/main.css';
import Button from 'react-bootstrap/Button';
import {Table} from 'react-bootstrap';

class Dropzone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: props.getStore().files,
        }
        this.isValidated = this.isValidated.bind(this);
    }

    dropRef = React.createRef();

    handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let div = this.dropRef.current;
        div.style.borderColor = "#2196f3";
    }

    handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let div = this.dropRef.current;
        div.style.borderColor = "#eeeeee";
    }

    handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let div = this.dropRef.current;
        div.style.borderColor = "#2196f3";
    }

    handleDrop = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if(this.props.getStore().userid === ''){
            let div = this.dropRef.current;
            div.style.borderColor = "#eeeeee";
            alert('请先登录或注册');
            window.location.href='/login';
            return;
        }

        let newfiles = this.state.files;
        let checkedfiles = this.checkDocument(e.dataTransfer.files);

        newfiles.push(...checkedfiles);

        this.setState({
            files: newfiles,
        });

        this.props.updateStore({
            files: newfiles,
        });

        let div = this.dropRef.current;
        div.style.borderColor = "#eeeeee";
    }

    changeUnit(size){
        if(size < 1024)
            return size+'B';
        else if(size < 1048576)
            return (size/1024).toFixed(1) + 'KB';
        else
            return (size/1048576).toFixed(1) + 'MB';
    }

    // TODO：添加add方法，保证文件名不重复


    checkDocument = files => {
        const result = [];
        const accept = ['.doc', '.docx', '.txt', '.csv', '.xls', '.xlsx', '.pdf'];
        for(var i = 0; i < files.length; i++){
            var file = files[i];
            const index = file.name.lastIndexOf('.');
            if (index < 0 || accept.indexOf(file.name.substr(index).toLowerCase()) < 0) { // 检查文件类型
                continue;
            }else{
                result.push(file);
            }
        }
        return result;
    };

    getFiles (e){
        e.stopPropagation();
        e.preventDefault();

        if(this.props.getStore().userid === ''){
            alert('请先登录或注册');
            window.location.href='/login';
            return;
        }

        let newfiles = this.state.files;
        newfiles.push(...e.target.files);

        this.setState({
            files: newfiles
        });
    }

    removeFile(e, index) {
        e.preventDefault();
        let files = this.state.files;
        files.splice(index, 1);
        this.setState({
            files: files,
        });
    }

    getFileSize(){
        const files = this.state.files;
        let size = 0;
        for(var i = 0; i < files.length; i++){
            size+=files[i].size;
        }
        return size;
    }

    isValidated() {
        const files = this.state.files;
        if(files.length > 0 && this.getFileSize() <= 200*1048576)
            return true;
        else
            return false;
    }

    componentDidMount() {
        let div = this.dropRef.current;
        div.addEventListener('dragenter', this.handleDragIn);
        div.addEventListener('dragleave', this.handleDragOut);
        div.addEventListener('dragover', this.handleDrag);
        div.addEventListener('drop', this.handleDrop);
    }

    render() {
        const localfiles = this.state.files;

        const fileItems = localfiles.map((file, index) => <tr key={index}>
            <td>{index+1}</td>
            <td>{file.name}</td>
            <td>{file.type}</td>
            <td>{this.changeUnit(file.size)}</td>
            <td><Button variant="danger"  onClick={e => this.removeFile(e, index)}>删除</Button></td>
        </tr>);

        return (
            <div className="col-lg-12">
                <div className="upload-window" ref={this.dropRef}>
                    <h4>将文件拖放至此处以上传</h4>
                    <p></p>
                    <p>数据上传格式要求：csv、xls、xlsx、txt、pdf、doc、docx</p>
                    <p>为保证运行稳定，建议文件总大小不超过 100MB</p>
                    <input type="file"
                           multiple="multiple"
                           id="file-upload"
                           accept=".csv, .xls, .xlsx, .txt, .pdf, .doc, .docx"
                            onChange={(e) =>this.getFiles(e)}
                    />
                    <label
                        htmlFor="file-upload"
                        id="browse"
                        className="btn browse btn-primary"
                        title="选择要上传的文件">选择要上传的文件</label>
                </div>
                {this.state.files.length===0?null:(<div className="mt-lg-3">
                    <Table>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>文件名</th>
                            <th>文件类型</th>
                            <th>文件大小</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fileItems}
                        </tbody>
                    </Table>
                </div>)}
            </div>
        )
    }
}

export default Dropzone;