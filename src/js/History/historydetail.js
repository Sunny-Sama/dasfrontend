import React from 'react';

class HistoryDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            id: props.location.state.id,
        }
    }

    render() {
        return (
            <div>
                history of {this.state.id}
            </div>
        );
    }
}

export default HistoryDetail;