import React from 'react';
import { Button, Divider, Message, Header } from 'semantic-ui-react';

const LoadingPanel = props => {
	const visitPage = (url) => {
		window.open(url, '_blank');
	}

	const createMessage = (design, message) => {
		return (<><Divider />
			<div className="message-outer-div">
				<Message compact>
					<Message.Header>{message}</Message.Header>
				</Message>
			</div>
		</>)
	}

	if (props.deployStatus == 'requesting') {
		return createMessage('warning', 'Approve the transaction in Metamask.')
	} else if (props.deployStatus == 'deploying') {
		return createMessage('success', 'Your contract is being deployed! Count down from 15...')
	} else if (props.deployStatus == 'minting') {
		return createMessage('success', 'Contract Deployed! Last step: Approve your token to be minted.')
	} else if (props.deployStatus == 'failed') {
		return createMessage('negative', 'Sorry, transaction failed. Try again!')
	} else if (props.deployStatus == 'success') {
		return (<><Divider />
			<Header as="h3">Success! It'll be live on OpenSea in 30-60 seconds :)</Header>
			<div className="success-buttons">
				<Button onClick={() => visitPage(props.etherscanUrl)} content="View on Etherscan" secondary />
				<Button onClick={() => visitPage(props.openseaUrl)} content="View on OpenSea" primary />
			</div>
		</>)
	} else {
		return ''
	}
}

export default LoadingPanel;