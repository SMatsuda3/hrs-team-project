# HRS Webアプリ 利用方法・設計説明書

作成日: 2026-07-24  
対象: `src/web` 配下のホテル予約システムWebアプリ

## 1. アプリ概要

HRSは、ホテルの空室検索、予約、予約確認、キャンセル、スタッフによるチェックイン・チェックアウト、管理者によるホテル管理を行うWebアプリである。

この実装は講義課題向けの静的Webアプリとして作られている。サーバーや本格的なデータベースは使わず、HTML、CSS、JavaScriptだけで動作する。データはブラウザの `localStorage` に保存する。

## 2. 実行環境

| 項目 | 内容 |
| --- | --- |
| 実装形式 | 静的Webアプリ |
| 使用言語 | HTML, CSS, JavaScript |
| フレームワーク | なし |
| ビルド処理 | なし |
| データ保存 | ブラウザの `localStorage` |
| データキー | `hrs-web-state-v2` |
| 公開方法 | GitHub Pages対応 |

## 3. ファイル構成

```text
src/web/
  index.html
  admin/
    index.html
  staff/
    index.html
  assets/
    hotel-hero.svg
  styles.css
  ui.js
  app.js
  README.md
  HRS_APPLICATION_GUIDE.md
```

各ファイルの役割は以下の通りである。

| ファイル | 役割 |
| --- | --- |
| `index.html` | 利用者向け画面の入口 |
| `admin/index.html` | 管理者向け画面の入口 |
| `staff/index.html` | スタッフ向け画面の入口 |
| `styles.css` | 画面の見た目、レイアウト、フォーム、カード、一覧表示のスタイル |
| `ui.js` | UI層。画面生成、ボタン操作、フォーム操作、画面遷移を担当 |
| `app.js` | アプリケーション層、ドメイン層、データ層。予約処理、空室計算、ログイン、保存処理を担当 |
| `assets/hotel-hero.svg` | トップ画面のビジュアル素材 |
| `README.md` | ログイン情報などの簡易メモ |
| `HRS_APPLICATION_GUIDE.md` | この詳細説明書 |

## 4. アクセス方法

ローカルで直接開く場合は、以下のHTMLをブラウザで開く。

| 画面 | ファイル |
| --- | --- |
| 利用者画面 | `src/web/index.html` |
| 管理者画面 | `src/web/admin/index.html` |
| スタッフ画面 | `src/web/staff/index.html` |

GitHub Pagesで公開した場合は、以下のようなURLになる。

```text
利用者画面:
https://ユーザー名.github.io/リポジトリ名/src/web/

管理者画面:
https://ユーザー名.github.io/リポジトリ名/src/web/admin/

スタッフ画面:
https://ユーザー名.github.io/リポジトリ名/src/web/staff/
```

## 5. ロールと画面

このアプリには3種類の利用者が存在する。

| ロール | 入口 | 主な機能 |
| --- | --- | --- |
| 利用者 | `/src/web/` | 空室検索、ログイン、新規登録、予約、予約確認、キャンセル |
| スタッフ | `/src/web/staff/` | 担当ホテルの予約確認、チェックイン、チェックアウト |
| 管理者 | `/src/web/admin/` | ホテル一覧、ホテル追加・編集、予約確認 |

スタッフ画面と管理者画面は、通常画面のメニューからは表示されない。URLを直接入力してアクセスする構成である。

## 6. ログイン方法

### 6.1 利用者ログイン

利用者画面右上のログインボタンからログインできる。

| Email | Password |
| --- | --- |
| `taro@example.com` | `user123` |
| `hanako@example.com` | `user123` |
| `ichiro@example.com` | `user123` |
| `misaki@example.com` | `user123` |
| `ken@example.com` | `user123` |

新規登録も利用者ログイン画面から行える。ログイン画面下部の「アカウントを新しく登録する」から新規登録画面へ移動する。

### 6.2 管理者ログイン

管理者画面は `src/web/admin/index.html` または `/src/web/admin/` から開く。

| ID | Password |
| --- | --- |
| `admin` | `admin123` |
| `admin001` | `admin123` |
| `manager001` | `admin123` |

### 6.3 スタッフログイン

スタッフ画面は `src/web/staff/index.html` または `/src/web/staff/` から開く。

スタッフアカウントはホテルごとに自動的に決まる。

```text
ID: hNNN-front
Password: front-hNNN
```

`NNN` はホテルIDの3桁番号である。たとえば、ホテルID `H001` のスタッフは以下のログイン情報になる。

```text
ID: h001-front
Password: front-h001
```

ホテルID `H030` なら以下になる。

```text
ID: h030-front
Password: front-h030
```

管理者が新しいホテルを追加して `H031` が作られた場合、そのホテルのスタッフログインは自動的に以下になる。

```text
ID: h031-front
Password: front-h031
```

## 7. 利用者向け機能

### 7.1 空室検索

利用者画面のトップで空室検索を行う。

入力項目は以下である。

| 項目 | 内容 |
| --- | --- |
| 地方 | 関東、関西、九州などで絞り込む |
| 都道府県 | 地方に応じた都道府県で絞り込む |
| 市区町村 | 都道府県に応じた市区町村で絞り込む |
| チェックイン | 宿泊開始日 |
| チェックアウト | 宿泊終了日 |
| 人数 | 利用人数 |
| 部屋タイプ | Single, Twin, Deluxe, Suite, Familyなど |

検索すると、条件に合う部屋タイプが一覧で表示される。

検索結果には以下が表示される。

- 部屋タイプ
- ホテル名
- 地域
- 宿泊数
- 人数
- 空室数
- 定員
- 料金

検索結果画面では並び替えができる。

| 並び替え | 内容 |
| --- | --- |
| 料金が安い順 | `estimatedAmount` の昇順 |
| 料金が高い順 | `estimatedAmount` の降順 |
| 空室が多い順 | `availableRooms` の降順 |
| 定員が多い順 | `capacity` の降順 |
| ホテル名順 | `hotelName` の昇順 |

### 7.2 予約

検索結果から「予約へ進む」を押すと予約入力へ進む。

予約にはユーザログインが必要である。未ログインの場合はログイン・新規登録画面に誘導される。

ログイン済みの場合、予約者情報はアカウント情報から取得される。利用者は検索条件を確認して「予約を確定する」を押す。

予約が完了すると予約番号が発行される。

予約番号の形式は以下である。

```text
R-YYYYMMDD-連番
```

例:

```text
R-20260724-001
```

### 7.3 予約確認

利用者画面の「予約確認」から確認できる。

利用者の場合、予約一覧はログイン中アカウントに紐づくものだけが表示される。

予約カードには以下が表示される。

- 予約番号
- 状態
- 顧客名
- メール
- ホテル
- 部屋タイプ
- 部屋番号
- 宿泊期間
- 人数
- 基本料金
- 会計状態
- キャンセル日時

### 7.4 予約キャンセル

利用者の予約確認画面からキャンセルできる。

キャンセルできるのは `RESERVED` 状態の予約のみである。

キャンセルすると予約状態は `CANCELLED` になり、キャンセル日時が記録される。キャンセル済み予約は空室計算から除外される。

## 8. スタッフ向け機能

スタッフは担当ホテルの予約のみ扱える。たとえば `h001-front` でログインしたスタッフは `H001` の予約だけ確認・チェックイン・チェックアウトできる。

### 8.1 スタッフトップ

スタッフログイン後、フロント業務画面が表示される。

表示される情報は以下である。

- 担当ホテル名
- 予約中件数
- 滞在中件数

左側のメニューには以下が表示される。

- 予約確認
- チェックイン
- チェックアウト

### 8.2 予約確認

スタッフ画面の「予約確認」から、予約番号、メール、電話番号で予約を検索できる。

ただし、担当ホテル以外の予約は表示・操作できない。

### 8.3 チェックイン

チェックイン画面では予約番号を入力する。

処理の流れは以下である。

1. 予約番号を入力する
2. 予約情報を表示する
3. 予約状態が `RESERVED` であることを確認する
4. 担当ホテルの予約であることを確認する
5. 空いている部屋を割り当てる
6. 予約状態を `CHECKED_IN` にする
7. 部屋状態を `OCCUPIED` にする
8. 宿泊記録を作成する

チェックイン時に会計はしない。会計はチェックアウト時にまとめて行う。

### 8.4 チェックアウト

チェックアウト画面では予約番号または部屋番号を入力する。

処理の流れは以下である。

1. 予約番号または部屋番号を入力する
2. 担当ホテルの滞在中予約を検索する
3. 追加料金があれば入力する
4. 基本料金と追加料金を合算する
5. 請求情報を作成する
6. 支払い情報を作成する
7. 予約状態を `CHECKED_OUT` にする
8. 部屋状態を `AVAILABLE` に戻す
9. 宿泊記録にチェックアウト日時を記録する

## 9. 管理者向け機能

### 9.1 管理者トップ

管理者ログイン後、管理者画面が表示される。

表示される情報は以下である。

- ホテル数
- 部屋タイプ数
- 部屋数
- 本日空室数

左側のメニューには以下が表示される。

- ホテル一覧
- 予約確認

### 9.2 ホテル一覧

ホテル一覧では登録済みホテルを確認できる。

表示項目は以下である。

- ホテルID
- ホテル名
- 住所
- 部屋タイプ
- 部屋数
- 本日空室数

### 9.3 ホテル追加・編集

管理者はホテルを追加・編集できる。

ホテル基本情報は以下である。

- ホテルID
- ホテル名
- 地方
- 都道府県
- 市区町村
- 住所
- 説明

ホテルIDは自動生成される。たとえば現在 `H030` まである場合、次に追加されるホテルIDは `H031` になる。

ホテルIDはスタッフログイン規則にも使われる。`H031` のホテルが追加されると、スタッフログインは自動的に `h031-front / front-h031` になる。

ホテル編集画面では、部屋タイプと部屋番号もまとめて編集できる。

部屋タイプには以下を設定できる。

- 部屋タイプID
- 名称
- 定員
- 1泊料金

部屋番号には以下を設定できる。

- 部屋ID
- 部屋番号
- 部屋タイプ
- 状態

## 10. サンプルデータ

現在の初期データは以下である。

| 種別 | 件数 |
| --- | ---: |
| ホテル | 30件 |
| 利用者アカウント | 5件 |
| 顧客 | 5件 |
| 部屋タイプ | 88件 |
| 部屋 | 143件 |
| スタッフアカウント | ホテルごとに自動判定 |

ホテルは北海道、関東、中部、関西、中国、四国、九州、沖縄などに分散している。

## 11. データ管理

このアプリはブラウザの `localStorage` にデータを保存する。

保存キーは以下である。

```text
hrs-web-state-v2
```

保存される主なデータは以下である。

- `accounts`
- `customers`
- `hotels`
- `roomTypes`
- `rooms`
- `reservations`
- `stays`
- `extraCharges`
- `invoices`
- `payments`
- `lastSearch`
- `resultSort`
- `role`
- `signedInUserId`
- `signedInHotelId`

注意点として、`localStorage` は同じブラウザ内だけで有効である。別の端末や別のブラウザにはデータは共有されない。

## 12. 設計方針

この実装は1つのJavaScriptファイルにすべてを詰め込んでいるように見えるが、役割は以下のように分けている。

```text
UI層
  index.html
  admin/index.html
  staff/index.html
  ui.js

アプリケーション層
  app.js のユースケース関数

ドメイン層
  app.js の予約、ホテル、部屋、支払いなどのデータ構造と状態遷移

データ層
  app.js の loadState / saveState / normalizeState
  localStorage
```

### 12.1 UI層

UI層は画面表示とイベント処理を担当する。

主なファイルは `ui.js` である。

UI層は、フォーム入力を受け取り、アプリケーション層の関数を呼び出す。予約状態や空室計算などのルールはUI層では直接判断しない。

### 12.2 アプリケーション層

アプリケーション層は、ユースケース単位の処理を担当する。

例:

- 空室検索
- 予約作成
- 予約確認
- 予約キャンセル
- チェックイン
- チェックアウト
- ログイン
- ホテル編集

これらの中心は `app.js` にある。

### 12.3 ドメイン層

ドメイン層は、ホテル予約システムとしての概念を扱う。

主なドメイン概念は以下である。

- Hotel
- RoomType
- Room
- Account
- Customer
- Reservation
- Stay
- ExtraCharge
- Invoice
- Payment

予約状態は以下で管理する。

```text
RESERVED
CANCELLED
CHECKED_IN
CHECKED_OUT
```

状態遷移は以下である。

```text
RESERVED -> CANCELLED
RESERVED -> CHECKED_IN
CHECKED_IN -> CHECKED_OUT
```

### 12.4 データ層

データ層は保存と復元を担当する。

現在は本格的なDBではなく `localStorage` を使っている。

アプリ起動時に `loadState()` が呼ばれ、保存データがなければ初期データを使う。保存データがある場合は、`normalizeState()` で新しい初期データとマージし、古い保存データでも新機能が動くようにしている。

## 13. 主要データ構造

### 13.1 Hotel

```js
{
  hotelId,
  name,
  region,
  prefecture,
  city,
  address,
  description
}
```

### 13.2 RoomType

```js
{
  roomTypeId,
  hotelId,
  name,
  capacity,
  pricePerNight
}
```

### 13.3 Room

```js
{
  roomId,
  hotelId,
  roomNumber,
  roomTypeId,
  status
}
```

部屋状態は以下である。

```text
AVAILABLE
OCCUPIED
OUT_OF_SERVICE
```

### 13.4 Account

```js
{
  accountId,
  customerId,
  name,
  email,
  phone,
  password,
  createdAt
}
```

### 13.5 Customer

```js
{
  customerId,
  name,
  email,
  phone
}
```

### 13.6 Reservation

```js
{
  reservationId,
  customerId,
  hotelId,
  roomTypeId,
  assignedRoomId,
  checkInDate,
  checkOutDate,
  guestCount,
  status,
  baseAmount,
  basePaid,
  reservedAt,
  createdAt,
  cancelledAt,
  checkedInAt,
  checkedOutAt
}
```

### 13.7 Stay

```js
{
  stayId,
  reservationId,
  roomId,
  actualCheckInAt,
  actualCheckOutAt
}
```

### 13.8 Invoice

```js
{
  invoiceId,
  reservationId,
  baseAmount,
  extraAmount,
  totalAmount,
  issuedAt
}
```

### 13.9 Payment

```js
{
  paymentId,
  reservationId,
  paymentType,
  amount,
  method,
  paidAt
}
```

## 14. 主要ユースケースと関数

### 14.1 空室検索

関係する主な関数:

- `renderHome()`
- `searchCard()`
- `searchAvailability(query)`
- `hotelMatchesLocation(hotelId, query)`
- `availableRoomCount(hotelId, roomTypeId, checkInDate, checkOutDate)`
- `overlappingReservationCount(hotelId, roomTypeId, checkInDate, checkOutDate)`
- `datesOverlap(aStart, aEnd, bStart, bEnd)`
- `renderResults()`
- `sortAvailabilityResults(results, sortKey)`

処理の流れ:

```text
利用者が検索条件を入力
  -> searchCard() がフォーム入力を query に変換
  -> searchAvailability(query)
  -> location条件、部屋タイプ、人数、日付を判定
  -> availableRoomCount() で空室数を計算
  -> renderResults() で一覧表示
  -> sortAvailabilityResults() で並び替え
```

空室数は単純な固定在庫ではなく、予約日程の重なりから計算している。

```text
空室数 = 対象部屋タイプの部屋数 - 日付が重なる予約数
```

日付が重なるかどうかは `datesOverlap()` で判定する。

### 14.2 予約作成

関係する主な関数:

- `renderResults()`
- `renderReserve()`
- `reserveRoom()`
- `requireCustomerAccount()`
- `syncCustomerFromAccount(account)`
- `id("R")`
- `saveState()`

処理の流れ:

```text
検索結果から部屋タイプを選択
  -> state.lastSearch に hotelId / roomTypeId を保存
  -> renderReserve()
  -> ログイン済みか確認
  -> reserveRoom()
  -> 再度 searchAvailability() で空室確認
  -> Reservationを作成
  -> saveState()
  -> renderComplete()
```

予約作成時には、ログイン中アカウントから顧客情報を取得する。これにより、予約はアカウント単位で管理される。

### 14.3 予約確認

利用者の場合:

- `renderCustomerReservations()`
- `reservationDetailsForSignedInUser()`
- `reservationDetails(reservationId)`
- `reservationCard(detail, allowCancel)`

スタッフ・管理者の場合:

- `renderLookup()`
- `lookupPanel(allowCancel)`
- `reservationDetailsList(keyword)`
- `staffReservationDetailsList(keyword)`
- `scopedReservations(reservations)`

スタッフの場合は `scopedReservations()` により、担当ホテル以外の予約が除外される。

### 14.4 予約キャンセル

関係する主な関数:

- `cancelReservation(reservationId)`
- `assertReservationTransition(reservation, "cancel")`
- `transitionReservation(reservation, "cancel")`
- `saveState()`

処理の流れ:

```text
予約確認画面でキャンセル
  -> cancelReservation()
  -> 予約状態が RESERVED か確認
  -> cancelledAt を記録
  -> status を CANCELLED に変更
  -> saveState()
```

### 14.5 チェックイン

関係する主な関数:

- `renderCheckIn()`
- `reservationDetails(reservationId)`
- `assertStaffCanAccessReservation(reservation)`
- `assertReservationTransition(reservation, "checkIn")`
- `checkIn(reservationId)`
- `transitionReservation(reservation, "checkIn")`
- `saveState()`

処理の流れ:

```text
スタッフが予約番号を入力
  -> reservationDetails()
  -> 担当ホテルの予約か確認
  -> RESERVED状態か確認
  -> 空いている部屋を探す
  -> assignedRoomId を設定
  -> Room.status を OCCUPIED に変更
  -> Reservation.status を CHECKED_IN に変更
  -> Stayを作成
  -> saveState()
```

### 14.6 チェックアウト

関係する主な関数:

- `renderCheckOut()`
- `checkOut(reservationKey, charges, method)`
- `assertStaffCanAccessReservation(reservation)`
- `assertReservationTransition(reservation, "checkOut")`
- `transitionReservation(reservation, "checkOut")`
- `saveState()`

処理の流れ:

```text
スタッフが予約番号または部屋番号を入力
  -> 対象予約を取得
  -> 担当ホテルの予約か確認
  -> CHECKED_IN状態か確認
  -> 追加料金を登録
  -> Invoiceを作成
  -> Paymentを作成
  -> Room.status を AVAILABLE に戻す
  -> Reservation.status を CHECKED_OUT に変更
  -> Stay.actualCheckOutAt を記録
  -> saveState()
```

### 14.7 ホテル管理

関係する主な関数:

- `renderAdmin()`
- `renderHotelAdmin()`
- `renderHotelEdit()`
- `nextHotelId()`
- `nextRoomTypeId(hotelId, offset)`
- `nextRoomId(offset)`
- `saveState()`

管理者はホテル、部屋タイプ、部屋番号をまとめて編集できる。

ホテル追加時には `nextHotelId()` により `H031` のようなホテルIDが自動生成される。

## 15. app.js の関数一覧

### 15.1 初期データ生成

| 関数 | 説明 |
| --- | --- |
| `buildExtraRoomTypes(hotels)` | 追加ホテルの部屋タイプを生成する |
| `buildExtraRooms(hotels)` | 追加ホテルの部屋番号を生成する |

### 15.2 ユースケース処理

| 関数 | 説明 |
| --- | --- |
| `searchAvailability(query)` | 検索条件に合う空室を返す |
| `reserveRoom()` | ログイン中ユーザで予約を作成する |
| `reservationDetails(reservationId)` | 予約詳細を取得する |
| `cancelReservation(reservationId)` | 予約をキャンセルする |
| `checkIn(reservationId)` | チェックイン処理を行う |
| `checkOut(reservationKey, charges, method)` | チェックアウトと会計処理を行う |
| `reservationDetailsList(keyword)` | 予約番号、メール、電話番号、名前で予約を検索する |
| `staffReservationDetailsList(keyword)` | スタッフ担当ホテル内で予約を検索する |
| `staffReservations()` | スタッフ担当ホテルの予約一覧を取得する |
| `reservationDetailsForSignedInUser()` | ログイン中ユーザの予約一覧を取得する |

### 15.3 日付・空室計算

| 関数 | 説明 |
| --- | --- |
| `validateDates(checkInDate, checkOutDate)` | 日付の妥当性を確認する |
| `datesOverlap(aStart, aEnd, bStart, bEnd)` | 宿泊期間が重なるか判定する |
| `nightsBetween(checkInDate, checkOutDate)` | 宿泊数を計算する |
| `totalRoomCount(hotelId, roomTypeId)` | 対象部屋タイプの部屋数を計算する |
| `overlappingReservationCount(...)` | 日付が重なる予約数を計算する |
| `availableRoomCount(...)` | 空室数を計算する |
| `totalAvailableRooms(...)` | ホテル全体の空室数を計算する |

### 15.4 ホテル・検索補助

| 関数 | 説明 |
| --- | --- |
| `defaultSearch()` | 初期検索条件を作る |
| `defaultHotel()` | デフォルトホテルを返す |
| `hotelById(hotelId)` | ホテルIDからホテルを取得する |
| `hotelMatchesLocation(hotelId, query)` | 地域条件に合うホテルか判定する |
| `locationOptions(level, filters)` | 地方、都道府県、市区町村の選択肢を作る |
| `roomTypeNameOptions()` | 選択可能な部屋タイプ名を返す |
| `featuredRoomTypes()` | トップ画面用の部屋タイプを返す |

### 15.5 認証・アカウント

| 関数 | 説明 |
| --- | --- |
| `normalizeLoginId(value)` | ログインIDを小文字化・正規化する |
| `authenticateOperator(userId, password, requiredRole)` | 管理者・スタッフログインを判定する |
| `loginUserAccount(email, password)` | 利用者ログインを判定する |
| `registerUserAccount(input)` | 利用者アカウントを新規登録する |
| `currentUserAccount()` | 現在ログイン中の利用者アカウントを返す |
| `requireCustomerAccount()` | 予約に必要なログイン状態を確認する |
| `syncCustomerFromAccount(account)` | アカウント情報を顧客情報へ同期する |
| `signIn(role, signedInUserId, signedInHotelId)` | ログイン状態を保存する |
| `normalizeSessionForPortal()` | 画面入口に合わないログイン状態をリセットする |
| `initialViewForPortal()` | 入口ごとの初期画面を決める |
| `loginViewForPortal()` | 入口ごとのログイン画面を決める |

### 15.6 権限・状態遷移

| 関数 | 説明 |
| --- | --- |
| `assertReservationTransition(reservation, action)` | 予約状態遷移が可能か確認する |
| `transitionReservation(reservation, action)` | 予約状態を変更する |
| `currentStaffHotelId()` | 現在ログイン中スタッフの担当ホテルIDを返す |
| `currentStaffHotel()` | 担当ホテルを返す |
| `scopedReservations(reservations)` | スタッフ権限に応じて予約を絞り込む |
| `assertStaffCanAccessReservation(reservation)` | 担当外ホテルの操作を拒否する |

### 15.7 ID生成・保存

| 関数 | 説明 |
| --- | --- |
| `nextHotelId()` | 次のホテルIDを作る |
| `nextRoomTypeId(hotelId, offset)` | 次の部屋タイプIDを作る |
| `nextRoomId(offset)` | 次の部屋IDを作る |
| `id(prefix)` | 予約、顧客、支払いなどのIDを作る |
| `isoDate(date)` | 日付をYYYY-MM-DD形式にする |
| `saveState()` | `localStorage` に保存する |
| `loadState()` | `localStorage` から読み込む |
| `normalizeState(rawState)` | 保存データを最新構造に補正する |
| `mergeSeedItems(seedItems, savedItems, key)` | 初期データと保存データをマージする |

## 16. ui.js の関数一覧

### 16.1 画面ルーティング

| 関数 | 説明 |
| --- | --- |
| `render(view)` | 指定された画面を描画する中心関数 |
| `syncHeader(view)` | ヘッダー表示とログイン状態を同期する |

### 16.2 利用者画面

| 関数 | 説明 |
| --- | --- |
| `renderHome()` | トップ画面を描画する |
| `searchCard()` | 空室検索フォームを描画する |
| `roomIntro()` | 部屋タイプ紹介を描画する |
| `roomTypeCard(type)` | 部屋タイプカードを描画する |
| `renderResults()` | 空室検索結果を描画する |
| `renderReserve()` | 予約確認・確定画面を描画する |
| `renderComplete()` | 予約完了画面を描画する |
| `renderCustomerReservations()` | 利用者の予約一覧を描画する |
| `renderAccount()` | 利用者ログイン画面を描画する |
| `renderRegister()` | 新規登録画面を描画する |

### 16.3 スタッフ・管理者画面

| 関数 | 説明 |
| --- | --- |
| `renderPortalLogin(requiredRole)` | 管理者・スタッフログイン画面を描画する |
| `staffMenu()` | スタッフメニューを返す |
| `adminMenu()` | 管理者メニューを返す |
| `renderStaff()` | スタッフトップ画面を描画する |
| `renderCheckIn()` | チェックイン画面を描画する |
| `renderCheckOut()` | チェックアウト画面を描画する |
| `renderAdmin()` | 管理者トップ画面を描画する |
| `renderHotelAdmin()` | ホテル一覧画面を描画する |
| `renderHotelEdit()` | ホテル追加・編集画面を描画する |
| `renderLookup()` | ロールに応じた予約確認画面を描画する |
| `lookupPanel(allowCancel)` | 予約検索フォームと結果表示領域を描画する |
| `checkInConfirmCard(detail)` | チェックイン確認カードを描画する |
| `checkInCompleteCard(detail)` | チェックイン完了カードを描画する |

### 16.4 UI部品・表示補助

| 関数 | 説明 |
| --- | --- |
| `workspacePage(title, subtitle, menu)` | 左メニュー付き業務画面を作る |
| `page(title, subtitle)` | 通常ページの土台を作る |
| `pageHeader(title, subtitle)` | ページ見出しを作る |
| `reservationCard(detail, allowCancel)` | 予約カードを作る |
| `metric(label, value)` | ダッシュボード指標カードを作る |
| `empty(message)` | 空表示メッセージを作る |
| `escapeHtml(value)` | HTMLエスケープする |
| `yen(amount)` | 金額を円表記にする |
| `optionList(options, selectedValue)` | selectのoptionを作る |
| `hotelLocationText(hotelId)` | ホテル所在地表記を作る |
| `sortAvailabilityResults(results, sortKey)` | 検索結果を並び替える |
| `el(tag, className)` | DOM要素を作る |
| `toast(message)` | 通知を表示する |

## 17. 保守性に関するポイント

### 17.1 状態遷移を1か所に集めている

予約状態の遷移は `RESERVATION_TRANSITIONS` と `assertReservationTransition()` に集めている。これにより、キャンセル、チェックイン、チェックアウトのルールが分散しにくい。

### 17.2 スタッフ権限を関数化している

スタッフが担当外ホテルを扱えないようにする処理は `assertStaffCanAccessReservation()` と `scopedReservations()` に集めている。

これにより、チェックイン、チェックアウト、予約検索の各処理で同じ制約を使い回せる。

### 17.3 保存データ補正を行っている

`normalizeState()` により、過去の `localStorage` データが残っていても、新しい初期データや新しいプロパティが追加される。

これにより、途中でホテル数やユーザ数を増やしても、古いブラウザ保存データと共存しやすい。

### 17.4 UI層と内部処理を分けている

画面表示は `ui.js`、業務処理は `app.js` に寄せている。

たとえば検索画面は `searchCard()` が担当するが、空室数の計算自体は `searchAvailability()` や `availableRoomCount()` が担当する。

## 18. 制限事項

このアプリは講義課題用の簡易Webアプリであるため、以下の制限がある。

- 本格的なサーバーはない
- 本格的なデータベースはない
- パスワードは安全に暗号化されていない
- `localStorage` のため、別端末とはデータ共有されない
- 複数人同時利用には向かない
- 実際の決済機能はない
- メール送信機能はない

ただし、ユースケース、画面遷移、状態遷移、空室計算、権限制御のデモとしては動作する。

## 19. GitHub Pagesでの注意

GitHub Pagesで公開する場合、アプリは以下のURLで開く。

```text
https://ユーザー名.github.io/リポジトリ名/src/web/
```

管理者画面とスタッフ画面は以下である。

```text
https://ユーザー名.github.io/リポジトリ名/src/web/admin/
https://ユーザー名.github.io/リポジトリ名/src/web/staff/
```

`src/web/.DS_Store` はMacが自動生成する不要ファイルなので、GitHubにはアップロードしない。

## 20. 発表時に説明しやすい要点

発表では、以下の順に説明するとよい。

1. 利用者が場所、日付、人数、部屋タイプで検索する
2. 検索結果を料金や空室数で並び替える
3. ログインして予約する
4. 予約番号が発行される
5. 利用者は予約確認画面で予約を確認・キャンセルできる
6. スタッフは `/staff/` からログインし、担当ホテルの予約だけ扱える
7. チェックインで部屋番号を割り当てる
8. チェックアウトで追加料金を含めて会計する
9. 管理者は `/admin/` からホテル、部屋タイプ、部屋番号を管理する
10. 内部処理はUI層、アプリケーション層、ドメイン層、データ層を意識して分けている

