# 31.10.18
Escrow

Код работает на:
- - - - - - -
Truffle v4.1.14
Solidity: 0.4.25+commit.59dbf8f1.Emscripten.clang
web3:  1.0.0-beta.36
- - - - - - -

Как проверить версию Solidity из трафл консоли:
- - - - - - - - - - -
var solc = require('solc')
solc.version()
- - - - - - - - - - -

Как посмотреть метамаск аккаунт из трафл консоли(они общие для метамаска и трафл консоли, это один блокчейн):
- - - - - - - - - - -
web3.eth.getAccounts((err, res)=> {acc = res})
acc[0]
acc[1]
и т.д.
- - - - - - - - - - -

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

1. Устанавливаем на тачку truffle или делаем переустановку если старенький
    sudo npm uninstall -g truffle типо такого, этот код я не проверил
 тип такого, потом инсталим его (все это в корневой папке путь на компе: '/')
2. Делаем npm init в папке где хотим создавать проект, появляется package.json, сюда будем инсталить все либки и зависимости.
3. Создаем чистую папку truffle в корневой папке проекта переходим в нее и делаем 'truffle init' из консоли
4. Cоздаем акк infura, в акке создаем проект, оттуда нужен будет API KEY
5. Устанавливаем metamask расширение для хрома, сохраняем тестовые слова (мнемоники), выбираем в нем Kovan и копируем его адресс
6. Переходим по ссылке:  https://faucet.kovan.network/, вводим этот адресс и получаем тестовые эфирки на метамаск кован адресс, проверяем в метамаске, что ефир капнул. Таким образом можно и в последующие дни полусать тестовый ефир.
7. В корневой папке проекта делаем npm install --save truffle-hdwallet-provider
8. В корневой папке проекта делаем sudo npm install --save dotenv
9. В корневой папке создаем новый файлик с названием .env и пишем в него
.env:
- - - - - - - - - -
MNENOMIC = 'Your metamask's recovery words' - Тестовые слова(мнемоники) которые получили при создании метамаск акка
INFURA_API_KEY = 'API KEY' - Находим на сайте инфуры в созданном проекте
- - - - - - - - - -
10. Добавляем код в truffle -> truffle.js:

truffle.js
- - - - - - - - - - - -

const HDWalletProvider = require("truffle-hdwallet-provider");

require('dotenv').config()

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    },
    ropsten: {
      provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY),
      network_id: 3,
      gas: 3000000,
      gasPrice: 21
    },
    kovan: {
      provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://kovan.infura.io/v3/" + process.env.INFURA_API_KEY),
      network_id: 42,
      gas: 3000000,
      gasPrice: 21
    },
    rinkeby: {
      provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY),
      network_id: 4,
      gas: 3000000,
      gasPrice: 21
    },
    main: {
      provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY),
      network_id: 1,
      gas: 3000000,
      gasPrice: 21
    }
  }
}

- - - - - - - - - - - -

12. Переходим в папку truffle
11. Cтартуем ропстен и траффл консоль: 'truffle console --testrpc --network kovan --verbosity 5'
12. В трафл консоли пишем 'migrate --reset'
13. Ждем когда контракт зальется в сеть. Если есть ошибки, то добавляем в контракте нагрузочный код к уже существующему в этом файле(дописываем):

Migration.sol:
- - - - - - - - - - -
uint public a;

constructor() public {
  owner = msg.sender;
  doNothing();
}

function doNothing() {
  a = 5;
}
- - - - - - -

14. Проверить можно на https://ropsten.etherscan.io/ введя в поле поиска номер транзакции из консоли.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Создание дополнительного аккаунта в трафл консоли если нужно:
1. Качаем 'npm install web3-eth-accounts' в корневую папку проекта, где лежит package.json (на одну папку выше папки truffle.)
2. Выполняем код в трафл консоли:
- - - - - - - - - - - - - - - - - -
var Accounts = require('web3-eth-accounts');
var accounts = new Accounts();
accounts.create();
- - - - - - - - - - - - - - - - - -

Как юзать методы web3.js:

1. Качаем 'npm i bluebird' в корневую папку проекта.
2. Выполняем в трафл консоли:
- - - - - - - - - - - - - - - -
const Promise = require('bluebird');
Promise.promisifyAll(web3.eth, { suffix: 'Promise' });
- - - - - - - - - - - - - - - -   

После этого у обьекта web3.eth появляются доп. методы на промисах по типу getAccountsPromise и нужно юзать их вместо
синхронных функций

Пример:
web3.eth.getAccountsPromise((error, result) =>{console.log(result)})

Доступное количество адрессов из трафл консоли(по умолчанию 1) и как поменять из truffle.js:
- - - - - - - - - - - -
provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY, 'индекс дефолтного адресса, я здесь ставлю ноль', 'количество доступных из трафл консоли адрессов, сколько нужно')
- - - - - - - - - - - -
Чтоб проверить инфу о текущем провайдере в трафл консоли печатаем  web3.currentProvider и видим список адрессов и кошелей а также инфу о приватном ключе и т.д.
