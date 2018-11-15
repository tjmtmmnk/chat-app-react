"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const semantic_ui_react_1 = require("semantic-ui-react");
const react_router_dom_1 = require("react-router-dom");
const channels = ['general', 'random'];
exports.ChannelList = () => {
    return (React.createElement(semantic_ui_react_1.Menu, { inverted: true, vertical: true, fixed: 'left' },
        React.createElement(semantic_ui_react_1.Menu.Item, { as: react_router_dom_1.Link, to: '/' },
            "Home",
            React.createElement(semantic_ui_react_1.Icon, { name: 'home' })),
        React.createElement(semantic_ui_react_1.Menu.Item, null,
            "Channels",
            React.createElement(semantic_ui_react_1.Icon, { name: 'list' },
                React.createElement(semantic_ui_react_1.Menu.Menu, null, channels.map(channel => React.createElement(semantic_ui_react_1.Menu.Item, { key: channel, name: channel, as: react_router_dom_1.NavLink, to: { pathname: `/channels/${channel}` } }, channel)))))));
};
//# sourceMappingURL=ChannelList.js.map