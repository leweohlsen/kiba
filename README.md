![alt text](https://github.com/leweohlsen/kiba/blob/main/src/assets/macos_icon_256.png)

# kiba

**ki**osk and **ba**nk system for hassle-free management of accounts, groups, products and transactions

## Features
* Create accounts with balances and organize them into groups
* Create products (along with product images) and organize them into categories
* Select Products to add them to the Shopping Cart or use a 2D-Barcode Scanning device
* Persist all transactions to disk in a sequence of traceable transactions

## Technical details
### Electron, React and Redux
Electron is used to wrap this application into a browser container for native cross-platform use. React is used along with the UI component library [Ant Design](https://ant.design/) and Redux is used for state-management - specifically redux-toolkit.

### Event Sourcing
All transactions (add account, add product, checkout products, ...) are persisted to a [JSONL](https://jsonlines.org/) file. When the application is opened, all historic transactions are replayed to generate the current state (e.g. account balances). The idea is to keep a complete explainable history that can be inspected in a separate view. Consistency between transactional data and current state are ensured. Historical events can be used to derive statistics.

## Contributing
Once checked out, the project dependencies can be installed with
```
npm i
```
and the local development server is started with
```
npm start
```
For a distributable build, use electron-forge to package and make installers:
```
npm run package   # creates a packaged app in the out/ directory
npm run make      # generates platform-specific installers in out/make/
```
The resulting installers (e.g., .dmg, .zip, .deb, .rpm, or Windows installer) will be placed in out/make.

Please refer to the [electron-forge](https://www.electronforge.io) docs for instructions on how to create a distributable build.

## TODO
* [x] Create a products page where categories and products can be created
* [x] Allow editing of groups, accounts, categories and products
* [x] Create a shopping cart that is visible 
* [x] Allow use of a USB barcode scanning device by catching EAN keyboard inputs in the product view
* [ ] i18n
* [ ] In case the event sourcing gets slow with many transactions, maybe implement snapshotting so we don't have to replay *all* events on every application start
