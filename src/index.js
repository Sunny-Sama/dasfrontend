import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import Navg from './js/Nav/nav';

class App extends React.Component {
    render() {
        return (
            <div>
                <Navg />
            </div>
        );
    }
}

// function Footer(){
//     return (
//         <footer className="modal-footer footer">Copyright © 2019 Fudan University. All Rights Reserved.</footer>
//     );
// }

// ========================================

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
