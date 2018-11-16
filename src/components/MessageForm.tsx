import * as React from 'react';
import {postMessage, Message} from '../client';
import {Button, Form, Segment, TextArea} from 'semantic-ui-react';

interface MesssageFormProps {
    channelName: string;
    setShouldReload: (shouldReload: boolean) => void;
}

interface MessageFormState {
    body?: string;
}

export class MessageForm extends React.Component<MesssageFormProps, MessageFormState> {
    constructor(props: MesssageFormProps) {
        super(props);
        this.state = {
            body: ''
        };
        this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    public render() {
        return (
            <Segment basic textAlign='center'>
                <Form onSubmit={this.handleFormSubmit}>
                    <Form.Field>
                        <TextArea autoHeight
                                  placeholder={'write your message'}
                                  value={this.state.body}
                                  onChange={this.handleTextAreaChange}/>
                    </Form.Field>
                    <Button primary type='submit'>Send</Button>
                </Form>
                <p>input value : {this.state.body}</p>
            </Segment>
        );
    }

    private handleTextAreaChange(event: React.FormEvent<HTMLTextAreaElement>) {
        event.preventDefault();
        this.setState({body: event.currentTarget.value});
    }

    private handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const payload = {
            body: this.state.body,
            user: {
                id : '123',
                name : 'nyan'
            }
        } as Message;

        postMessage(this.props.channelName, payload)
            .then(() => {
                this.setState({body: ''});
                this.props.setShouldReload(true); //メッセージ投稿時にリロード通知をpropsを通じてMessageFeedに伝える
            })
            .catch(err => {
                console.log(err);
            });
    }
}

