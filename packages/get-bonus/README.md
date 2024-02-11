# get-bonus

[![version](https://img.shields.io/npm/v/get-bonus?label=get-bonus)](https://www.npmjs.com/package/get-bonus)
[![License](https://img.shields.io/github/license/YurierDept/get-bonus)](https://github.com/YurierDept/get-bonus/blob/main/LICENSE)
[![CI](https://github.com/YurierDept/get-bonus/actions/workflows/ci.yml/badge.svg)](https://github.com/YurierDept/get-bonus/actions/workflows/ci.yml)

## 安装 / Installation

```bash
npm i get-bonus
# or yarn
yarn add get-bonus
# or pnpm 
pnpm i get-bonus
```

## 使用 / Usage

```ts
import { Scraper, Melonbooks, Animate, Mangaoh, Comiczin, Gamers, Toranoana } from 'get-bonus'

const providers = [
  new Melonbooks(),
  new Animate(),
  new Toranoana(),
  new Gamers(),
  new Mangaoh(),
  new Comiczin()
]
const scraper = new Scraper(...providers)

const searchResult = await scraper.search(`...`)
const details = await scraper.getAllDetails(searchResult)
```

## 使用协议 / License

[LICENSE](/LICENSE)

本程序附带 MIT License 开源。使用本程序及其源代码时，请遵守 MIT License。

This program comes with the MIT License.
