# Keplr Fee Overrider
Web form to send transactions through the Keplr extension. It adds a fee override for cheaper transacting. Focused on Kava, but should work on other networks.

![](keplrexample.png)

## Requirements
* [Keplr extension](https://github.com/chainapsis/keplr-wallet/) installed in your browser
* NodeJS with NPM
* a git clone or downloaded copy of this repo

## Local deployment
Install dependencies
```
npm install
```

Run the development server
```
NODE_OPTIONS=--openssl-legacy-provider npm run dev
```

Navigate to http://localhost:8081/

## Usage: simple send
On the `Simple Send` form, fill the intended Recipient, Memo, and Amount to send. Click on the `Submit` button; Keplr should popup. Approve the transaction on Keplr **without** touching the fee controls. The transaction will broadcast.

You can adjust the desired gas limit and fee rate by editing the `src/main.js` file.

## Usage: transaction
For other transactions, use the `Transaction` form. Input the *message type*, the *message value*, and the gas limit.

A simple way to find out what should those be consists in preparing the intended transaction on the official website, e.g., one of the several operations available on https://app.kava.io/. When the Keplr popup opens to sign the transaction, it should display the required message type and value. Switch from the *Details* tab to the *Data tab* to show the payload message in JSON format, under the 'msgs' key. The gas limit appears under *Advanced*. Copy those fields from the Keplr popup window to the form at localhost:8081, and then reject the Keplr popup.

Click on the `Submit` button; Keplr should popup. Approve the transaction on Keplr **without** touching the fee controls. The transaction will broadcast. Broadcasting errors should appear on the console. Check for confirmation and eventual success or failure of the transaction via some external means, such as the Mintscan explorer.

![](kavaapp.png)
