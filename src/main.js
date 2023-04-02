import { SigningCosmosClient } from '@cosmjs/launchpad'
import {
    DirectSecp256k1HdWallet,
    Registry,
} from '@cosmjs/proto-signing'

import {
    assertIsBroadcastTxSuccess,
    SigningStargateClient,
    defaultRegistryTypes as defaultStargateTypes,
} from '@cosmjs/stargate'

import { MsgPlaceBid } from '@kava-labs/javascript-sdk/lib/proto/kava/auction/v1beta1/tx';
import {
  MsgCreateAtomicSwap,
  MsgClaimAtomicSwap,
  MsgRefundAtomicSwap,
} from '@kava-labs/javascript-sdk/lib/proto/kava/bep3/v1beta1/tx';
import {
  MsgCreateCDP,
  MsgDeposit,
  MsgWithdraw,
  MsgDrawDebt,
  MsgRepayDebt,
  MsgLiquidate,
} from '@kava-labs/javascript-sdk/lib/proto/kava/cdp/v1beta1/tx';
import {
  MsgSubmitProposal,
  MsgVote,
} from '@kava-labs/javascript-sdk/lib/proto/kava/committee/v1beta1/tx';
import {
  MsgDeposit as HardMsgDeposit,
  MsgWithdraw as HardMsgWithdraw,
  MsgBorrow,
  MsgRepay,
} from '@kava-labs/javascript-sdk/lib/proto/kava/hard/v1beta1/tx';
import {
  MsgClaimUSDXMintingReward,
  MsgClaimHardReward,
  MsgClaimDelegatorReward,
  MsgClaimSwapReward,
  MsgClaimEarnReward,
  MsgClaimSavingsReward,
} from '@kava-labs/javascript-sdk/lib/proto/kava/incentive/v1beta1/tx';
import {
  MsgIssueTokens,
  MsgRedeemTokens,
  MsgBlockAddress,
  MsgUnblockAddress,
  MsgSetPauseStatus,
} from '@kava-labs/javascript-sdk/lib/proto/kava/issuance/v1beta1/tx';
import { MsgPostPrice } from '@kava-labs/javascript-sdk/lib/proto/kava/pricefeed/v1beta1/tx';
import {
  MsgDeposit as SwapMsgDeposit,
  MsgWithdraw as SwapMsgWithdraw,
  MsgSwapExactForTokens,
  MsgSwapForExactTokens,
} from '@kava-labs/javascript-sdk/lib/proto/kava/swap/v1beta1/tx';

import {
  MsgMintDeposit,
  MsgWithdrawBurn,
  MsgDelegateMintDeposit,
  MsgWithdrawBurnUndelegate,
} from '@kava-labs/javascript-sdk/lib/proto/kava/router/v1beta1/tx';

import { ExtensionOptionsWeb3Tx } from '@kava-labs/javascript-sdk/lib/proto/ethermint/types/v1/web3';
import { PubKey } from '@kava-labs/javascript-sdk/lib/proto/ethermint/crypto/v1/ethsecp256k1/keys';

import {
  MsgConvertERC20ToCoin,
  MsgConvertCoinToERC20,
} from '@kava-labs/javascript-sdk/lib/proto/kava/evmutil/v1beta1/tx';

import {
  MsgDeposit as EarnMsgDeposit,
  MsgWithdraw as EarnMsgWithdraw,
} from '@kava-labs/javascript-sdk/lib/proto/kava/earn/v1beta1/tx';

const kavaRegistryTypes = [
  ...defaultStargateTypes,
  ['/kava.auction.v1beta1.MsgPlaceBid', MsgPlaceBid],
  ['/kava.bep3.v1beta1.MsgCreateAtomicSwap', MsgCreateAtomicSwap],
  ['/kava.bep3.v1beta1.MsgClaimAtomicSwap', MsgClaimAtomicSwap],
  ['/kava.bep3.v1beta1.MsgRefundAtomicSwap', MsgRefundAtomicSwap],
  ['/kava.cdp.v1beta1.MsgCreateCDP', MsgCreateCDP],
  ['/kava.cdp.v1beta1.MsgDeposit', MsgDeposit],
  ['/kava.cdp.v1beta1.MsgWithdraw', MsgWithdraw],
  ['/kava.cdp.v1beta1.MsgDrawDebt', MsgDrawDebt],
  ['/kava.cdp.v1beta1.MsgRepayDebt', MsgRepayDebt],
  ['/kava.cdp.v1beta1.MsgLiquidate', MsgLiquidate],
  ['/kava.committee.v1beta1.MsgSubmitPropsal', MsgSubmitProposal],
  ['/kava.committee.v1beta1.MsgVote', MsgVote],
  ['/kava.hard.v1beta1.MsgDeposit', HardMsgDeposit],
  ['/kava.hard.v1beta1.MsgWithdraw', HardMsgWithdraw],
  ['/kava.hard.v1beta1.MsgBorrow', MsgBorrow],
  ['/kava.hard.v1beta1.MsgRepay', MsgRepay],
  [
    '/kava.incentive.v1beta1.MsgClaimUSDXMintingReward',
    MsgClaimUSDXMintingReward,
  ],
  ['/kava.incentive.v1beta1.MsgClaimHardReward', MsgClaimHardReward],
  ['/kava.incentive.v1beta1.MsgClaimDelegatorReward', MsgClaimDelegatorReward],
  ['/kava.incentive.v1beta1.MsgClaimSwapReward', MsgClaimSwapReward],
  ['/kava.incentive.v1beta1.MsgClaimEarnReward', MsgClaimEarnReward],
  ['/kava.incentive.v1beta1.MsgClaimSavingsReward', MsgClaimSavingsReward],
  ['/kava.issuance.v1beta1.MsgIssueTokens', MsgIssueTokens],
  ['/kava.issuance.v1beta1.MsgRedeemTokens', MsgRedeemTokens],
  ['/kava.issuance.v1beta1.MsgBlockAddress', MsgBlockAddress],
  ['/kava.issuance.v1beta1.MsgUnblockAddress', MsgUnblockAddress],
  ['/kava.issuance.v1beta1.MsgSetPauseStatus', MsgSetPauseStatus],
  ['/kava.pricefeed.v1beta1.MsgPostPrice', MsgPostPrice],
  ['/kava.swap.v1beta1.MsgDeposit', SwapMsgDeposit],
  ['/kava.swap.v1beta1.MsgWithdraw', SwapMsgWithdraw],
  ['/kava.swap.v1beta1.MsgSwapExactForTokens', MsgSwapExactForTokens],
  ['/kava.swap.v1beta1.MsgSwapForExactTokens', MsgSwapForExactTokens],
  ['/ethermint.types.v1.ExtensionOptionsWeb3Tx', ExtensionOptionsWeb3Tx],
  ['/ethermint.crypto.v1.ethsecp256k1.PubKey', PubKey],
  ['/kava.evmutil.v1beta1.MsgConvertERC20ToCoin', MsgConvertERC20ToCoin],
  ['/kava.evmutil.v1beta1.MsgConvertCoinToERC20', MsgConvertCoinToERC20],
  ['/kava.earn.v1beta1.MsgDeposit', EarnMsgDeposit],
  ['/kava.earn.v1beta1.MsgWithdraw', EarnMsgWithdraw],
  ['/kava.router.v1beta1.MsgMintDeposit', MsgMintDeposit],
  ['/kava.router.v1beta1.MsgWithdrawBurn', MsgWithdrawBurn],
  ['/kava.router.v1beta1.MsgDelegateMintDeposit', MsgDelegateMintDeposit],
  ['/kava.router.v1beta1.MsgWithdrawBurnUndelegate', MsgWithdrawBurnUndelegate],
];

window.onload = async () => {
    // Keplr extension injects the offline signer that is compatible with cosmJS.
    // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
    // And it also injects the helper function to `window.keplr`.
    // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
    if (!window.getOfflineSigner || !window.keplr) {
        alert("Please install keplr extension");
    } else {
        if (window.keplr.experimentalSuggestChain) {
            try {
                // Keplr v0.6.4 introduces an experimental feature that supports the feature to suggests the chain from a webpage.
                // cosmoshub-3 is integrated to Keplr so the code should return without errors.
                // The code below is not needed for cosmoshub-3, but may be helpful if you’re adding a custom chain.
                // If the user approves, the chain will be added to the user's Keplr extension.
                // If the user rejects it or the suggested chain information doesn't include the required fields, it will throw an error.
                // If the same chain id is already registered, it will resolve and not require the user interactions.
                await window.keplr.experimentalSuggestChain({
    "rpc": "https://rpc-kava.keplr.app",
    "rest": "https://lcd-kava.keplr.app",
    "chainId": "kava_2222-10",
    "chainName": "Kava",
    "stakeCurrency": {
        "coinDenom": "KAVA",
        "coinMinimalDenom": "ukava",
        "coinDecimals": 6,
        "coinGeckoId": "kava"
    },
    "walletUrl": "https://wallet.keplr.app/chains/kava",
    "walletUrlForStaking": "https://wallet.keplr.app/chains/kava",
    "bip44": {
        "coinType": 459
    },
    "alternativeBIP44s": [
        {
            "coinType": 118
        }
    ],
    "currencies": [
        {
            "coinDenom": "KAVA",
            "coinMinimalDenom": "ukava",
            "coinDecimals": 6,
            "coinGeckoId": "kava"
        },
        {
            "coinDenom": "SWP",
            "coinMinimalDenom": "swp",
            "coinDecimals": 6,
            "coinGeckoId": "kava-swap"
        },
        {
            "coinDenom": "USDX",
            "coinMinimalDenom": "usdx",
            "coinDecimals": 6,
            "coinGeckoId": "usdx"
        },
        {
            "coinDenom": "HARD",
            "coinMinimalDenom": "hard",
            "coinDecimals": 6
        },
        {
            "coinDenom": "BNB",
            "coinMinimalDenom": "bnb",
            "coinDecimals": 8
        },
        {
            "coinDenom": "BTCB",
            "coinMinimalDenom": "btcb",
            "coinDecimals": 8
        },
        {
            "coinDenom": "BUSD",
            "coinMinimalDenom": "busd",
            "coinDecimals": 8
        },
        {
            "coinDenom": "XRPB",
            "coinMinimalDenom": "xrpb",
            "coinDecimals": 8
        }
    ],
    "bech32Config": {
        "bech32PrefixAccAddr": "kava",
        "bech32PrefixAccPub": "kavapub",
        "bech32PrefixValAddr": "kavavaloper",
        "bech32PrefixValPub": "kavavaloperpub",
        "bech32PrefixConsAddr": "kavavalcons",
        "bech32PrefixConsPub": "kavavalconspub"
    },
    "feeCurrencies": [
        {
            "coinDenom": "KAVA",
            "coinMinimalDenom": "ukava",
            "coinDecimals": 6,
            "coinGeckoId": "kava",
            "gasPriceStep": {
                "low": 0.001,
                "average": 0.005,
                "high": 0.05
            }
        }
    ],
    "coinType": 459
                });
            } catch {
                alert("Failed to suggest the chain");
            }
        } else {
            alert("Please use the recent version of keplr extension");
        }
    }

    const chainId = "kava_2222-10";

    // You should request Keplr to enable the wallet.
    // This method will ask the user whether or not to allow access if they haven't visited this website.
    // Also, it will request user to unlock the wallet if the wallet is locked.
    // If you don't request enabling before usage, there is no guarantee that other methods will work.
    await window.keplr.enable(chainId);

    const offlineSigner = window.getOfflineSigner(chainId);

    // You can get the address/public keys by `getAccounts` method.
    // It can return the array of address/public key.
    // But, currently, Keplr extension manages only one address/public key pair.
    // XXX: This line is needed to set the sender address for SigningCosmosClient.
    const accounts = await offlineSigner.getAccounts();

    // Initialize the gaia api with the offline signer that is injected by Keplr extension.
    const cosmJS = new SigningCosmosClient(
        "https://rpc.kava.io",
        accounts[0].address,
        offlineSigner,
    );
    
    window.keplr.defaultOptions = {
    sign: {
        preferNoSetFee: true,
    }};

    document.getElementById("address").append(accounts[0].address);
};

document.sendForm.onsubmit = () => {
    (async () => {
        // See above.
        const chainId = "kava_2222-10";
        await window.keplr.enable(chainId);
        const offlineSigner = window.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        const myRegistry = new Registry(kavaRegistryTypes);
        const client = await SigningStargateClient.connectWithSigner(
            "https://rpc.kava.io",
            offlineSigner,
            { registry: myRegistry },
        )
        const typeA = document.sendForm.typeA.value
        const typeB = document.sendForm.typeB.value
        const payload = document.sendForm.payload.value.replace(/(\_\w)/g, i => i[1].toUpperCase()) // needs camelCase instead of snake_case
        const gas = document.sendForm.gas.value

        let typeUrl = ''
        switch (document.sendForm.registryClass.value) {
            case 'kava':
            typeUrl = '/kava.'+typeA+'.v1beta1.'+typeB
            break
            case 'cosmos-sdk': 
            typeUrl = '/cosmos.'+typeA+'.v1beta1.'+typeB
            break
            case 'ibc': 
            typeUrl = '/ibc.core.'+typeA+'.v1.'+typeB
            break
            case 'ibc-applications': 
            typeUrl = '/ibc.applications.'+typeA+'.v1.'+typeB
            break
        }

        const message = [{
         typeUrl,
         value: kavaRegistryTypes.find(i => i[0] === typeUrl)[1].fromPartial(JSON.parse(payload)),
        }];
        const feeAmount = Math.floor(parseInt(gas) * 1e-3) // minimum fee rate is 1000 microkava
        const fee = {
            amount: [{
                denom: 'ukava',
                amount: feeAmount.toString(),
            }, ],
            gas,
        }

        const result = await client.signAndBroadcast(accounts[0].address, message, fee, "")
        assertIsBroadcastTxSuccess(result)

        if (result.code !== undefined &&
            result.code !== 0) {
            alert("Failed to send tx: " + result.log || result.rawLog);
        } else {
            alert("Succeed to send tx:" + result.transactionHash);
        }
    })();

    return false;
};

document.simpleForm.onsubmit = () => {
    (async () => {
        // See above.
        const chainId = "kava_2222-10";
        await window.keplr.enable(chainId);
        const offlineSigner = window.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        const client = await SigningStargateClient.connectWithSigner(
            "https://rpc.kava.io",
            offlineSigner
        )

        const recipient = document.simpleForm.recipient.value;
        const memo = document.simpleForm.memo.value;
        const amount = document.simpleForm.amount.value;

        const amountFinal = {
            denom: '',
            amount: '',
        }
        switch (document.simpleForm.token.value) {
            case 'KAVA':
                amountFinal.denom = 'ukava'
                amountFinal.amount = Math.floor(parseFloat(amount) * 1e6).toString()
                break
            case 'BUSD':
                amountFinal.denom = 'busd'
                amountFinal.amount = Math.floor(parseFloat(amount) * 1e8).toString()
                break
        }

        const fee = {
            amount: [{
                denom: 'ukava',
                amount: '120',
            }, ],
            gas: '120000',
        }

        const result = await client.sendTokens(accounts[0].address, recipient, [amountFinal], fee, memo)
        assertIsBroadcastTxSuccess(result)

        if (result.code !== undefined &&
            result.code !== 0) {
            alert("Failed to send tx: " + result.log || result.rawLog);
        } else {
            alert("Succeed to send tx:" + result.transactionHash);
        }
    })();

    return false;
};
