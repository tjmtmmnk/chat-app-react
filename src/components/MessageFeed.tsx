import * as React from 'react';
import {fetchMessages, Message} from '../client';
import {Segment, Image, Comment, Header} from 'semantic-ui-react';
import {publicDecrypt} from 'crypto';
import {render} from 'react-dom';

interface MessageFeedProps { //このComponentのpropsに関する定義
    channelName: string;
    shouldReload: boolean;
    setShouldReload: (shouldReload: boolean) => void;
}

interface MessageFeedState { //このComponentが管理するstateに関する定義
    messages: Message[]; //Message[] : client.tsで定義したインターフェイス
}

export class MessageFeed extends React.Component<MessageFeedProps, MessageFeedState> {
    constructor(props: MessageFeedProps) {
        super(props);
        this.state = {
            messages: []
        };
    }

    public render() {
        return (
            <Comment.Group>
                <Header as='h3' dividing>{this.props.channelName}</Header>
                {this.state.messages.slice().reverse().map(message =>
                    <Comment key={message.id}>
                        <Comment.Avatar src={message.user.avatar || '/img/avatar.png'}/>
                        <Comment.Content>
                            <Comment.Author as='a'>{message.user.name}</Comment.Author>
                            <Comment.Metadata>
                                <div>{message.date}</div>
                            </Comment.Metadata>
                            <Comment.Text>
                                {message.body}
                            </Comment.Text>
                        </Comment.Content>
                    </Comment>
                )}
            </Comment.Group>
        );
    }

    private fetchMessages = (channelName: string) => {
        this.props.setShouldReload(false); //reload通知が来たことを知らせるために状態を変える
        fetchMessages(channelName)
            .then(response => {
                this.setState({messages: response.data.messages});
            })
            .catch(err => {
                console.log(err);
            });
    };

    //初期マウント時にチャンネル名で指定されたメッセージを取得する
    public componentDidMount() {
        this.fetchMessages(this.props.channelName);
    }

    //チャンネル名が変わった時またはreload通知が来たときに新たにメッセージを取得する
    public componentDidUpdate(prevProps: MessageFeedProps) {
        if ((prevProps.channelName !== this.props.channelName) || (!prevProps.shouldReload && this.props.shouldReload)) {
            this.fetchMessages(this.props.channelName);
        }
    }

}
