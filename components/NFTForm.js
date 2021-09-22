import React, { useState, useEffect } from 'react'

import { ethers } from "ethers"
import SimpleERC721 from '../contracts/SimpleERC721.json'

import { Header, Form, Button, Divider } from 'semantic-ui-react';

const NFTForm = props => {
	const deployNFTContract = async (e) => {
	    e.preventDefault();
	    const NFTForm = e.target;
	    const nameEl = NFTForm["name"]
	    const colEl = NFTForm["collection"]
	    const descEl = NFTForm["desc"]

	    // UPLOAD THE IMAGE AND GET THE IMG URL
	    let imgUrl = '';

	    var formdata = new FormData();
	    formdata.append("image", props.combinedImgUrl);
	    formdata.append("key", "e9d442f40e728999049cde0fafed39ee");

	    var imgRequestOptions = { method: 'POST', body: formdata, redirect: 'follow' };

	    try {
	      const img_resp = await fetch("https://api.imgbb.com/1/upload", imgRequestOptions)
	      const img_result = await img_resp.text()
	      imgUrl = JSON.parse(img_result).data.url
	      console.log('Image URL created at: ', imgUrl)
	    } catch (err) {
	      console.log('error', err)
	      props.setDeployStatus('failed')
	    }

	    // CREATE THE JSON METADATA INCLUDING THE IMG URL
	    let jsonUrl = '';

	    let headers = new Headers();
	    headers.append("Content-Type", "application/json");
	    headers.append("X-Bin-Private", "false");
	    headers.append("X-Bin-Name", "NAME");
	    headers.append("X-Master-Key", "$2b$10$UMvjOuR/vDPJuih4/tULfOYMo2IHjcppZLPOn6GkVR6JmsHy3ur0W");

	    let raw = JSON.stringify({
	      "name": nameEl.value,
	      "description": descEl.value,
	      "image": imgUrl
	    });

	    let jsonRequestOptions = { method: 'POST', headers: headers, body: raw, redirect: 'follow' };

	    try {
	      const json_resp = await fetch("https://api.jsonbin.io/v3/b", jsonRequestOptions)
	      const json_result = await json_resp.text()
	      jsonUrl = `https://api.jsonbin.io/b/${JSON.parse(json_result).metadata.id}`
	      console.log('JSON URL created at: ', jsonUrl)
	    } catch (err) {
	      console.log('error', err)
	      props.setDeployStatus('failed')
	    }

	        
	    // DEPLOY THE NFT AND LINK TO THE JSON METADATA
	    try {
	      await window.ethereum.request({ method: 'eth_requestAccounts'});
	      props.setDeployStatus('requesting')
	      const provider = new ethers.providers.Web3Provider(window.ethereum);
	      const signer = provider.getSigner();
	      const signerAddress = await signer.getAddress();

	      const NFT = await new ethers.ContractFactory(SimpleERC721.abi, SimpleERC721.bytecode, signer);
	      const nft = await NFT.deploy(colEl.value, "NFT", jsonUrl);
	      props.setDeployStatus('deploying')
	      await nft.deployed();
	      console.log("NFT deployed to: ", nft.address);
	      props.setEtherscanUrl(`https://rinkeby.etherscan.io/address/${nft.address}`)
	      props.setOpenseaUrl(`https://testnets.opensea.io/assets/${nft.address}/0`)
	      await nft.zachMint(signerAddress, 0);
	      console.log("Token 0 minted and assigned to: ", signerAddress)
	      props.setDeployStatus('success')
	    } catch (err) {
	      console.log(err);
	      props.setDeployStatus('failed')
	    }
	}


	return (
		props.combinedImgUrl && props.deployStatus == 'pending' ?
		<>
			<Divider />
			<Header as="h3">Want to make it into an NFT?</Header>
			<Form onSubmit={deployNFTContract}>
				<Form.Group widths="equal">
					<Form.Input label="Name: " type="text" name="name" />
					<Form.Input label="Collection: " type="text" name="collection" />
				</Form.Group>
				<Form.Input label="Description: " type="text" name="desc" />
				<Form.Group className="field-around-btn" widths='equal'>
					<Form.Button animated type="submit" id="nft-btn" primary>
						<Button.Content visible>NFT it!</Button.Content>
						<Button.Content hidden>🚀</Button.Content>
					</Form.Button>
				</Form.Group>
			</Form>
		</>
		: ""
	)
};

export default NFTForm;