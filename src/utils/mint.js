import { abi } from "./abi";
import {
  GAS_INCREASE,
} from "./const";
import {
  CONTRACTADDRESS,
  PRICE,
} from "./configuration";
import { getMintStatus } from "./status";

import { transactionHostURL,decodeWhiteListKey } from "./util";

const formatMintTransaction = async (data) => {
  const web3 = data.state.web3;
  const address = data.state.address;
  const chainId = data.state.chainId;
  const count = data.state.count;
  const proof = data.state.proof;
  const targetContract = CONTRACTADDRESS[chainId];
  var contract = new web3.eth.Contract(abi, targetContract);

  let extraData;
  var mintType = await getMintStatus(data);
  if (!mintType) {
    mintType = data.state.mintType;
  }
  if (mintType === "public") {
    
    // whitelist mint
    //var proof1 = proof.split(",")
    //console.log(proof1.length)
    if (proof.length > 0) {
      var key = decodeWhiteListKey(proof).split(",")
      //console.log(proof)
      console.log(key)
      extraData = await contract.methods.whitelistMint(count,key);
    } else {
      extraData = await contract.methods.mint(count);
    }
    //var proof = ["0x702d0f86c1baf15ac2b8aae489113b59d27419b751fbf7da0ef0bae4688abc7a","0xb159efe4c3ee94e91cc5740b9dbb26fc5ef48a14b53ad84d591d0eb3d65891ab"]
    //extraData = await contract.methods.whitelistMint(count,proof1);
  } else {
    //throw new Error("Sales is not start yet.");
    throw new Error("You are not in white list, bro.");
  }
  console.log(extraData)
  let input = extraData.encodeABI();
  const finalPrice = count * PRICE;
  const estimatedGas = await web3.eth.estimateGas({
    from: address,
    data: input,
    to: targetContract,
    value: web3.utils.toWei(finalPrice.toString(), "ether"),
  });
  const nonce = await web3.eth.getTransactionCount(address, "latest");
  return {
    gas: parseInt(estimatedGas * GAS_INCREASE),
    to: targetContract,
    from: address,
    value: web3.utils.toWei(finalPrice.toString(), "ether"),
    data: web3.utils.toHex(input),
    nonce,
  };
};

export const MintTransaction = async (data) => {
  if (!data.state.web3) {
    return;
  }

  if (data.state.mintErrorMsg) {
    data.setState({
      mintErrorMsg: "",
    });
  }

  try {
    const tx = await formatMintTransaction(data);
    function sendTransaction(_tx) {
      return new Promise((resolve, reject) => {
        data.state.web3.eth
          .sendTransaction(_tx)
          .once("transactionHash", (txHash) => resolve(txHash))
          .catch((err) => reject(err));
      });
    }
    const result = await sendTransaction(tx);
    data.setState({
      txn: result,
      pendingRequest: true,
      modalDialogBodyHref: `${transactionHostURL(
        data.state.chainId
      )}/${result}`,
      modalDialogBodyText:
        "You have approved the transaction, please don't close the dialog until your transaction completes successfully.",
    });
    const interval = setInterval(function () {
      data.state.web3.eth.getTransactionReceipt(result, function (err, rec) {
        if (rec) {
          clearInterval(interval);
          data.setState({
            finish: true,
            pendingRequest: false,
            modalDialogBodyHref: `${transactionHostURL(
              data.state.chainId
            )}/${result}`,
            modalDialogBodyText: `Successfully minted NFT!`,
          });
        }
      });
    }, 1000);
  } catch (error) {
    console.error("CATCHERROR", error.message);
    var myRe = /{.*}/g;
    var str = error.message.replace(/(\r\n|\n|\r)/gm, "");
    var errArray = myRe.exec(str);
    if (errArray && errArray.length > 0) {
      if (JSON.parse(errArray[0]).originalError.message) {
        const errorDetails = JSON.parse(errArray[0]).originalError.message;
        data.setState({
          mintErrorMsg: errorDetails,
        });
      } else {
        data.setState({
          mintErrorMsg: error.message,
        });
      }
    } else {
      data.setState({
        mintErrorMsg: error.message,
      });
    }
  }
};

