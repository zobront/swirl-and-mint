import React from 'react';
import { Button, Divider, Header } from 'semantic-ui-react';

const LoadingPanel = props => {
	if (props.deployStatus == 'requesting') {
		return <><Divider /><Header as="h3">Approve the transaction in Metamask.</Header></>
	} else if (props.deployStatus == 'deploying') {
		return <><Divider /><Header as="h3">The block is chaining! Count down from 15...</Header></>
	} else if (props.deployStatus == 'failed') {
		return <><Divider /><Header as="h3">Sorry, transaction failed! Try again.</Header></>
	} else {
		return ''
	}
}

export default LoadingPanel;