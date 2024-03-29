import React from 'react';
import User from './User.jsx';

import List from 'material-ui/List/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import LockOutline from 'material-ui/svg-icons/action/lock-outline';
import LockOpen from 'material-ui/svg-icons/action/lock-open';
import Person from 'material-ui/svg-icons/social/person';

const styles = {
    userListStyle: {
        textAlign: 'left'
    },
};

class UserList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };


    // todo update icons propperly using state or props
    render() {
        var fn = this;
        return (
            <List style={styles.userListStyle}>
                <Subheader>Users</Subheader>
                <Divider/>
                {Object.keys(this.props.users).map(function (key) {

                    var userIcon = <LockOpen/>;
                    if (SessionHelper.getUsername() === key) {
                        userIcon = <Person/>;
                    } else if (SessionHelper.hasAesKey(key)) {
                        userIcon = <LockOutline/>;
                    }

                    return <User
                        userClickCallback={fn.props.userClickCallback}
                        key={key}
                        userIcon={userIcon}
                        username={key}/>;
                })}
                <Divider/>
            </List>
        );
    };
}

// give theme context
UserList.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};
export default (UserList);