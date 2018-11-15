import * as React from 'react';
import {match} from 'react-router-dom';
import {MessageFeed} from '../components/MessageFeed';

interface ChannelMatch {
    channelName: string;
}

interface ChannelProps {
    match: match<ChannelMatch>;
}

export class Channel extends React.Component<ChannelProps, {}> {
    constructor(props: ChannelProps) {
        super(props);
    }

    public render() {
        const {channelName} = this.props.match.params;
        return (
            <MessageFeed channelName={channelName}/>
        );
    }
}

