const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
import { BigNumber, utils, ethers } from 'ethers';

export const getMerkleTree = (
  accounts: ethers.providers.JsonRpcSigner[],
  amounts: BigNumber[],
  nonce: number,
) => {
  let leafNodes = accounts.map((account, index) =>
    getLeafNode(account, amounts[index], nonce),
  );

  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  return merkleTree;
};

export const getLeafNode = (
  account: ethers.providers.JsonRpcSigner,
  amount: BigNumber,
  nonce: number,
) =>
  keccak256(
    utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'uint64'],
      [account._address, amount, nonce],
    ),
  );