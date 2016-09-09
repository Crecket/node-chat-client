import React  from 'react';

import ListItem from 'material-ui/List/ListItem';

class User extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};

        this.userClickCallback = this.userClickCallback.bind(this);
    };

    userClickCallback() {
        // send click event to react app
        this.props.userClickCallback(this.props.username);
    };

    render() {
        return (
            <ListItem
                onClick={this.userClickCallback.bind(this)}
                rightIcon={this.props.userIcon}
                primaryText={this.props.username}
                key={this.props.username}
            />
        );
    };
}

// give theme context
User.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};
export default (User);