![logo](https://user-images.githubusercontent.com/4670058/147123484-9f43b7a7-6ffb-4eaa-a991-bd9a716a0f4a.png)

[themarkets.io](https://themarkets.io/)

## Build Setup 

```bash
# install dependencies
$ cd frontend
$ npm install
$ cd ..
$ cd backend
$ npm install

# run from root folder not `frontend` or 'backend'
$ cd ..
$ yarn develop

# build for production
$ npm run build

# deploy
$ cd frontend
$ npm run build
$ firebase deploy
```

-------------

### Overview

Our app started off focussing on the traditional markets but we're now shifting focus to crypto, memestocks, defi, gamefi, nfts, carbon offsets and other emerging markets such as the metaverse. The markets have gone through a revolution in the last few years most exemplified by Gamestop. Now a meme can turn a failing company into a billion-dollar success. We want to provide a hub for new investors to find the latest news, trends and market prices.

---

### Data

Currently our main data provider is finage for stocks, crypto, indices, bonds, forex and news. We also use coinmarketcap to fetch the top 50 crypto coins by market cap since finage does not provide this data. Recently we added Trading Economics api data to collect commodities including EU Carbon Offsets.

We are trialling [Stockpulse](https://stockpulse.ai/) as a potential replacement to finage. We have a free trial which expires on January 31st 2022. Their data also includes market sentiment analysis which they call 'buzz'. This could be useful for further developing our app.

---

### Folder structure

From the root folder you will see the top folders 'frontend' and 'backend'. 'frontend' is for the main app while 'backend' is for Strapi. From the root folder you can run `yarn develop` to run both locally in dev mode.

Currently the lists of market categories are kept in market.js, this is used for fetching data and rendering IndexList components throughout the app.

The layouts/default file currently takes care of all data collection processes. Rather than use the store, data is emitted to pages and components via the event bus.

Within the pages directory we have subdirectories for each market category i.e. /cryptocurrency. Each subdirectory contains an index page which lists all symbols of it's type and a _symbol page for individual symbol details and charts. There are also subdirectories for our different Strapi content sections - personal-finance, analysis, magazine, trading-101.

---

### Components

I will just cover the most important, heavily-used components.

##### IndexList > Price

The IndexList render the lists of each category on the homepage and each category index page. They require different style depending on which page and category they are rendered. For index pages we use a grid style and for movers/rising lists the style is also slightly different. A sub component of the IndexList is Price, this is necessary for updating the price data and show visual changes, i.e. flashing green/red. The Price layout varies dependant on the list in which it has been rendered as well.

##### Item > Chart

The Item component is used on every _symbol page to render the main content of the page. This helps maintain consistentcy across the categories. Some pages also render the latest news on their symbol and info about the instrument such as market cap for a coin. The main feature of each symbol page is the Chart. Originally we used highcharts for this, however, we have recently switched to using TradingView since they provide Candlestick charts which update in real-time. When users select a short time range such as 1/5/15 minutes we fetch new aggregate data so the charts can update in real-time.

##### Header > Ticker > TickerItem

The Header contains the desktop and mobile navigation menus and the Ticker bar. The Ticker displays a small number of top symbols. Each symbol is rendered via the TickerItem component. The Ticker component is also used for styling the icons throughout the site. The icon class is set via the market.js file. It would be nice to set class names dynamically instead of hardcoding, however, we use PNG , SVGs and GIfs depending on the category so this is currently the best way of styling icons. Ideally the data provider would include icon data instead.

---

### Current issues

There have been many issues with our current data provider, finage, unstable connections, missing endpoints for certain symbols, the aggregate endpoint is inconsistent. We’ve been waiting months for finage to release CFD/Futures data for indices. We use websockets for live data streaming, the connection isn’t always stable. We also need to display when each symbols market is open, the finage market indicators api is quite basic, it just shows if an entire market is open, i.e. forex / nasdaq.

We need to refactor our data collection architecture, currently all api and websocket calls are made in layouts/default. Preferably the data is fetched by a standalone node.js app which then feeds this through to the main app, runs cron jobs on set intervals to keep lists up to date such as the top 50 crypto coins and takes CPU load off the main app.

---

### Backlog

The full backlog of issues and requested features can be found [here](https://urala.atlassian.net/browse/UA-7)

---

### Roadmap

#### Completed milestones
- App research and development began December 2020
- Data provider secured February 2021
- MVP design finished April 2021
- MVP launched October 2021
- Strapi CMS added November 2021
- Candlestick charts added December 2021
- Search function for all symbols with autosuggest added January 2022

#### Future milestones
- Add indice CFDs and Futures
- Refactor data collection via node.js app and GraphQL
- Toggle index list to cards
- Add crypto coin categories DeFi, GameFi, DAO, Memecoins, NFTs
- Redesign UI with a gamified, pixel art style
- User accounts
- Social features: comments threads, discord, SNS
- Integrate lightstreamer

---

#### Strapi CMS

We are using Strapi CMS for our content section, currently this is just /personal-finance articles. However, we intend to continue growing this area of the site.

--------------

### Cryptocurrency
Top 50 by marketcap

### Forex
EURUSD, USDJPY, USDKRW, USDTRY, GBPUSD, USDBRL, USDILS, USDRUB

### Commodities
EU Carbon Offsets, Gold, Silver, Natural Gas, Crude Oil, Brent Oil, Coffee, Platinum, Cobalt, Solar Energy Index, Wind Energy Index, CRB Index, LME Index

### Stocks 
Apple, Pfizer, Amazon, Facebook, Microsoft, Moderna, NIO, Tesla, Nvidia, Xpeng, Palantir, Boeing, Santander, Alibaba, Gamestop, AMC, BlackBerry

### Indices
NASDAQ, NASDAQ CFD, NASDAQ Futures, DOW JONES, DOW JONES CFD, DOW JONES Futures, S&P 500, S&P 500 CFD, S&P 500 Futures, FTSE, FTSE CFD, FTSE Futures, NIKKEI, NIKKEI CFD, NIKKEI Futures, HANG SENG, HANG SENG CFD, HANG SENG Futures, SHANGHAI, SHANGHAI CFD, SHANGHAI Futures, KOSPI, KOSPI CFD, KOSPI Futures, DAX, DAX CFD, DAX Futures, IBEX 35, IBEX 35 CFD, IBEX Futures, BIST 100, BIST 100 CFD, BIST 100 Futures, Dollar Index

### Bonds
US 1M Bond, US 3M Bond, US 6M Bond, US 1 Year Bond, US 2 Year Bond, US 5 Year Bond, US 7 Year Bond, US 10 Year Bond, US 20 Year Bond, US 30 Year Bond

