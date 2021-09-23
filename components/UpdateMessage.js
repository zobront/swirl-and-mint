import React from 'react';
import { Divider, Message, Header } from 'semantic-ui-react';

const UpdateMessage = props => {
	return (
		<>
			<Divider />
			<div className="message-outer-div">
				<Message compact>
					<Message.Header>{props.content}</Message.Header>
				</Message>
			</div>
		</>
	)
}

export default UpdateMessage;