import React from 'react';
import { Button, Divider, Message, Header } from 'semantic-ui-react';
import UpdateMessage from './UpdateMessage'

const ResultsPanel = props => {
	const visitPage = (url) => {
		window.open(url, '_blank');
	}

	if (props.deployStatus == 'requesting') {
		return <UpdateMessage style="warning" content='Approve the transaction in Metamask.' />
	} else if (props.deployStatus == 'deploying') {
		return <UpdateMessage style="success" content="Your contract is being deployed! Count down from 15..." />
	} else if (props.deployStatus == 'minting') {
		return <UpdateMessage style="success" content="Contract Deployed! Last step: Approve your token to be minted." />
	} else if (props.deployStatus == 'failed') {
		return <UpdateMessage style="negative" content="Sorry, transaction failed. Try again!" />
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

export default ResultsPanel;