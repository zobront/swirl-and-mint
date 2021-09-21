import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../components/Layout'
import styles from '../styles/Home.module.css'
import { NFTStorage, File, toGatewayURL } from 'nft.storage'
import React, { useState, useEffect } from 'react'
import { ethers } from "ethers"
import SimpleERC721 from '../artifacts/contracts/SimpleERC721.sol/SimpleERC721'

export default function Home() {
  // const [metadata, setMetadata] = useState();
  // const [url, setURL] = useState();
  // const [address, setAddress] = useState();

  const uploadToIPFS = async (e) => {
    e.preventDefault();
    const form = e.target;
    const nameEl = form["name"]
    const symEl = form["symbol"]
    const descEl = form["desc"]
    const fileEl = form["img"]

    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDIxNDJhMUY2OWFFN0Y0MDM0OWY3NWNjMjY4MmYwOWI1NjIwM2ZDMzIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMjE1MjAwMDk1NCwibmFtZSI6Ik5GVCBZb3Vyc2VsZiJ9.7CloiFpuou-M6FY5cRoSiU297ur6QE0M-35O0HahYrM'
    const client = new NFTStorage({ token: apiKey })
    
    let metadataUrl = '';

    try {
      const metadata = await client.store({
        name: nameEl.value,
        description: descEl.value,
        image: fileEl.files[0],
        attributes: []
      })
      metadataUrl = metadata.url
    } catch (err) {
      console.log(err)
    }
    console.log(metadataUrl)
    await deployNFTContract(nameEl.value, descEl.value, metadataUrl);
  }

  const deployNFTContract = async (name, desc, uri) => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();

      const NFT = await new ethers.ContractFactory(SimpleERC721.abi, SimpleERC721.bytecode, signer);
      const nft = await NFT.deploy(name, desc, uri, signerAddress);
      await nft.deployed();
      console.log("NFT deployed to:", nft.address, "and image minted as Token #0");
      
      console.log(await nft.name());
      console.log(await nft._manager());
      console.log(await nft.tokenURI(0));
      console.log(await nft.ownerOf(0));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Layout>
      <h1>Turn Yourself Into an NFT</h1>
      <p>Uploading a photo to OpenSea is great, but it means they are the owner of the contract.</p>
      <p>Upload here to create your own ERC721 Smart Contract with a 1/1 NFT of your face :)</p>
      <form onSubmit={uploadToIPFS}>
        <label>Name: <input type="text" name="name" /></label>
        <label>Symbol: <input type="text" name="symbol" /></label>
        <label>Description: <input type="text" name="desc" /></label>
        <label>Image: <input type="file" name="img" /></label>
        <button type="submit">Upload</button>
      </form>
    </Layout>
  );
}