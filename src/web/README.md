# HRS Web App Login Guide

このフォルダはホテル予約システムのWeb版です。

## URL

- 利用者画面: `src/web/index.html`
- 管理者画面: `src/web/admin/index.html`
- スタッフ画面: `src/web/staff/index.html`

GitHub Pagesで公開している場合は、以下のようなURLになります。

- 利用者画面: `https://ユーザー名.github.io/リポジトリ名/src/web/`
- 管理者画面: `https://ユーザー名.github.io/リポジトリ名/src/web/admin/`
- スタッフ画面: `https://ユーザー名.github.io/リポジトリ名/src/web/staff/`

## 管理者ログイン

管理者はホテル一覧、ホテル追加・編集、予約確認を行えます。

| ID | Password |
| --- | --- |
| `admin` | `admin123` |
| `admin001` | `admin123` |
| `manager001` | `admin123` |

## スタッフログイン規則

スタッフアカウントはホテルごとに1つです。

- ID: `hNNN-front`
- Password: `front-hNNN`

`NNN` はホテルIDの3桁番号です。  
例: `H001` のスタッフは `h001-front / front-h001` です。

| Hotel ID | Hotel Name | Staff ID | Password |
| --- | --- | --- | --- |
| `H001` | Waseda Hotel | `h001-front` | `front-h001` |
| `H002` | Shinjuku Garden Hotel | `h002-front` | `front-h002` |
| `H003` | Bay View Hotel | `h003-front` | `front-h003` |
| `H004` | Kyoto Riverside Hotel | `h004-front` | `front-h004` |
| `H005` | Sapporo North Hotel | `h005-front` | `front-h005` |
| `H006` | Osaka Namba Grand Hotel | `h006-front` | `front-h006` |
| `H007` | Umeda Business Hotel | `h007-front` | `front-h007` |
| `H008` | Kobe Harbor Hotel | `h008-front` | `front-h008` |
| `H009` | Nara Park View Hotel | `h009-front` | `front-h009` |
| `H010` | Nagoya Station Hotel | `h010-front` | `front-h010` |
| `H011` | Kanazawa Castle Hotel | `h011-front` | `front-h011` |
| `H012` | Mt Fuji Lake Hotel | `h012-front` | `front-h012` |
| `H013` | Niigata Riverside Hotel | `h013-front` | `front-h013` |
| `H014` | Yokohama Minato Hotel | `h014-front` | `front-h014` |
| `H015` | Kamakura Seaside Inn | `h015-front` | `front-h015` |
| `H016` | Chiba Bay Hotel | `h016-front` | `front-h016` |
| `H017` | Saitama Urban Hotel | `h017-front` | `front-h017` |
| `H018` | Sendai Aoba Hotel | `h018-front` | `front-h018` |
| `H019` | Aomori Station Hotel | `h019-front` | `front-h019` |
| `H020` | Morioka Central Hotel | `h020-front` | `front-h020` |
| `H021` | Hiroshima Peace Hotel | `h021-front` | `front-h021` |
| `H022` | Okayama Korakuen Hotel | `h022-front` | `front-h022` |
| `H023` | Matsue Lake Hotel | `h023-front` | `front-h023` |
| `H024` | Takamatsu Port Hotel | `h024-front` | `front-h024` |
| `H025` | Matsuyama Castle Hotel | `h025-front` | `front-h025` |
| `H026` | Fukuoka Tenjin Hotel | `h026-front` | `front-h026` |
| `H027` | Nagasaki Harbor Hotel | `h027-front` | `front-h027` |
| `H028` | Kumamoto Castle Hotel | `h028-front` | `front-h028` |
| `H029` | Kagoshima Tenmonkan Hotel | `h029-front` | `front-h029` |
| `H030` | Okinawa Naha Resort | `h030-front` | `front-h030` |

スタッフは、自分のホテルの予約確認、チェックイン、チェックアウトのみ操作できます。

## 利用者ログイン例

| Email | Password |
| --- | --- |
| `taro@example.com` | `user123` |
| `hanako@example.com` | `user123` |
| `ichiro@example.com` | `user123` |
| `misaki@example.com` | `user123` |
| `ken@example.com` | `user123` |
