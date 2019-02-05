import React from 'react';

class Divider extends React.Component {
    render() {
        return (
            <div className="divider">
                <p>{this.props.fact}</p>
            </div>
        )
    }
}

export default Divider;