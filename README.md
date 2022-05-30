# kiba

integrated **ki**osk and **ba**nk system for hassle-free management of accounts, groups, products and transactions

## Features
* Persist all transactions to disk
* Create accounts and organize them into groups
* Create products (along with product images) and organize them into categories

## Technical details
### Electron, React and Redux
Electron is used to wrap this application into a browser container for native cross-platform use. React is used along with the UI component library [Ant Design](https://ant.design/) and Redux is used for state-management - specifically redux-toolkit.

### Event Sourcing
All transactions (add account, add product, checkout products, ...) are persisted to a JSON file. When the application is opened, all historic transactions are replayed to generate the current state (e.g. account balances). The idea is to keep a complete explainable history that can be inspected in a separate view. Consistency between transactional data and current state are ensured. Historical events can be used to derive statistics.

## Contributing
Once checked out, the project dependencies can be installed with
```
npm i
```
and the local development server is started with
```
npm start
```

Please refer to the [electron-forge](https://www.electronforge.io) docs for instructions on how to create a distributable build.

## TODO
* [x] Create a products page where categories and products can be created
* [ ] Allow editing of groups, accounts, categories and products
* [x] Create a shopping cart that is visible 
* [ ] Allow use of a USB barcode scanning device by catching EAN keyboard inputs in the product view
* [ ] In case the event sourcing gets slow with many transactions, maybe implement snapshotting so we don't have to replay *all* events on every application start
