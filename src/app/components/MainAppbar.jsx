import React  from 'react';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton/index';
import IconMenu from 'material-ui/IconMenu/index';
import MenuItem from 'material-ui/MenuItem/index';
import MessageIcon from 'material-ui/svg-icons/communication/message';
import ColorLensIcon from 'material-ui/svg-icons/image/color-lens';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {cyan800} from 'material-ui/styles/colors';

const styles = {
    appbar: {
        width: '100%',
    },
};

class MainAppbar extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    };

    render() {
        var logoutOption;

        // if user is logged in, show logout
        if (this.props.loggedin) {
            logoutOption = <MenuItem onClick={this.props.logoutCallback} primaryText="Logout"/>;
        }

        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="box">
                        {<AppBar
                            style={styles.appbar}
                            title="NodeJS End-To-End"
                            iconElementLeft={<IconButton><MessageIcon /></IconButton>}
                            iconElementRight={<IconMenu
                                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                                {logoutOption}
                                <MenuItem onClick={this.props.openSettingsModal} primaryText="Settings"/>
                                <MenuItem onClick={this.props.setTheme} primaryText="Change Theme"/>
                            </IconMenu>}
                        />}
                    </div>
                </div>
            </div>
        );
    };
}


// give theme context
MainAppbar.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};
export default (MainAppbar);