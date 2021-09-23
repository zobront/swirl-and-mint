import React, { useState, useEffect } from 'react'

import { ethers } from "ethers"
import SimpleERC721 from '../contracts/SimpleERC721.json'

import { Header, Form, Button, Divider, Message } from 'semantic-ui-react';

const NFTForm = props => {
	const [formState, setFormState] = useState("");

	const chain_mapping = {
		'0x1': 'Ethereum Mainnet',
		'0x4': 'Rinkeby Test Network',
		'0x137': 'Polygon Mainnet'
	}

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
	      if (props.chainId == '0x1') {
	      	props.setEtherscanUrl(`https://etherscan.io/address/${nft.address}`)
	      	props.setOpenseaUrl(`https://opensea.io/assets/${nft.address}/0`)
	      } else if (props.chainId == '0x4') {
	      	props.setEtherscanUrl(`https://rinkeby.etherscan.io/address/${nft.address}`)
	      	props.setOpenseaUrl(`https://testnets.opensea.io/assets/${nft.address}/0`)
	      } else if (props.chainId == '0x137') {
	      	props.setEtherscanUrl(`https://polygonscan.com/address/${nft.address}`)
	      	props.setOpenseaUrl(`https://opensea.io/assets/matic/${nft.address}/0`)
	      } else {
	      	props.setEtherscanUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
	      	props.setOpenseaUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
	      }
	      props.setDeployStatus('minting')
	      await nft.initialMint(signerAddress, 0);
	      console.log("Token 0 minted and assigned to: ", signerAddress)
	      props.setDeployStatus('success')
	    } catch (err) {
	      console.log(err);
	      props.setDeployStatus('failed')
	    }
	}

	useEffect(() => {
		if (props.deployStatus == 'pending' && props.combinedImgUrl) {
			if (props.hasMetamask) {
				if (props.chainId in chain_mapping) {
					setFormState("Ready")	
				} else {
					setFormState("You must be on Ethereum Mainnet, Polygon Mainnet, or Rinkeby Test Network to mint an NFT.")
				}
			} else {
				setFormState("You must install Metamask to mint an NFT!")
			}
		} else {
			setFormState("")
		}
	})

	const noFormDisplay = () => {
		if (formState) {
			return (
				<div className="message-outer-div">
					<Message negative compact>
						<Message.Header>{formState}</Message.Header>
						{!props.hasMetamask ? <p>Follow <a href="https://blog.wetrust.io/how-to-install-and-use-metamask-7210720ca047" target="_blank">these instructions</a> to get it installed.</p> : ''}
					</Message>
				</div>
			)
		}
		return ""
	}

	return (
		formState == "Ready" ?
		<>
			<Divider />
			<Header as="h3">Like It? Mint an NFT on the <i>{chain_mapping[props.chainId]}</i>.</Header>
			<p className="subheader"><a href="https://i.ibb.co/zbRKkF2/OpenSea.png" target="_blank">(Where do these fields populate on OpenSea?)</a></p>
			<Form onSubmit={deployNFTContract}>
				<Form.Group widths="equal">
					<Form.Input label="Name: " type="text" name="name" />
					<Form.Input label="Collection: " type="text" name="collection" />
				</Form.Group>
				<Form.Input label="Description: " type="text" name="desc" />
				<Form.Group className="field-around-btn">
					<Form.Button animated type="submit" id="nft-btn" primary>
						<Button.Content visible>NFT it!</Button.Content>
						<Button.Content hidden>🚀</Button.Content>
					</Form.Button>
				</Form.Group>
			</Form>
		</>
		: <>{noFormDisplay()}</>
	)
};

export default NFTForm;