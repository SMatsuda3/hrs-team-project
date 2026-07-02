# 01 ドメイン分析（演習1）

> **このファイルの使い方（担当A向け）**
> 計画書の内容をたたき台として展開してあります。`（TODO: …）` の箇所を埋め、
> 必要に応じて概念クラスの追加・削除、判断理由の記入を行ってください。
> ここでは実装都合（画面・CUI・ファイル保存・DB・Controller など）は入れません。
> あくまで「ホテル業務の世界に何が存在するか」を表します。
>
> 対応Issue: `[Domain] 概念クラス候補を整理する` / `[Domain] 概念クラス図を作成する`

---

## 1. ドメイン分析の目的

ホテル予約業務に存在する概念と、その関係を整理する。実装方法ではなく、業務の概念を表すことが目的。

---

## 2. 業務シナリオ

1. 顧客は宿泊日・泊数・人数・希望する部屋種別を指定して空室を探す。
2. 顧客は空いている部屋種別を選び、氏名や連絡先を登録して予約する。
3. システムは予約番号を発行し、顧客は予約番号を確認する。
4. チェックイン日に、顧客はフロント係に予約番号を伝える。
5. フロント係は予約を確認し、部屋番号を割り当てる。
6. 顧客は宿泊する。
7. チェックアウト時、顧客は部屋番号を伝える。
8. フロント係は宿泊料を確認し、顧客は支払いを行う。
9. 支払い完了後、宿泊は完了し、部屋は再び利用可能になる。
10. 顧客はチェックイン前であれば予約をキャンセルできる。

（TODO: チームで追加・修正したいシナリオがあれば追記）

---

## 3. 概念クラス候補

まずは広めに洗い出す。すべてを図に採用する必要はない。

| 概念クラス | 主な属性候補 | 意味・性質 | 採用 | 判断メモ |
|---|---|---|:--:|---|
| Customer（顧客） | customerId, name, phone, email | 部屋を予約し宿泊する人。複数の予約を持てる | ○ | |
| Staff（フロント係） | staffId, name | チェックイン・チェックアウトなどの受付業務を行う人 | △ | 実装では省略可。図に残すか要相談 |
| Hotel（ホテル） | hotelId, name | 部屋を所有する施設。デモでは1つでよい | ○ | |
| Room（部屋） | roomNumber, status | 宿泊対象の具体的な部屋（例:301号室）。チェックイン時に割当 | ○ | |
| RoomType（部屋種別） | typeId, name, capacity, pricePerNight | シングル/ツイン等。予約時は部屋そのものより種別を指定 | ○ | |
| Reservation（予約） | reservationId, checkInDate, checkOutDate, status, createdAt | 顧客が将来の宿泊を確保した事実。番号と状態を持つ | ○ | |
| Stay（宿泊） | stayId, actualCheckInAt, actualCheckOutAt | チェックイン後に発生する実際の宿泊。予約と区別 | ○ | |
| Invoice（請求） | invoiceId, totalAmount, issuedAt | チェックアウト時に発生する宿泊料の請求 | ○ | |
| Payment（支払い） | paymentId, amount, method, paidAt | 顧客が宿泊料を支払った事実 | ○ | |
| DateRange（宿泊期間） | startDate, endDate, nights | 宿泊期間を表す値 | △ | Reservationの属性に含めるか、独立の値にするか要判断 |
| ReservationStatus（予約状態） | RESERVED, CANCELLED, CHECKED_IN, CHECKED_OUT | 予約の状態。キャンセル/チェックイン可否の判定に使う | ○ | 列挙として扱う |
| RoomStatus（部屋状態） | AVAILABLE, OCCUPIED, OUT_OF_SERVICE | 部屋の利用可否 | ○ | 列挙として扱う |
| Money（金額） | amount, currency | 料金を表す値。小規模実装では整数でも可 | △ | 整数で代用するなら不採用でも可 |

> 採用列：○=採用 / △=検討中 / ×=不採用。（TODO: △を確定させる）

---

## 4. 採用しないもの（概念モデルに入れない）

実装上のクラスはドメイン分析のクラス図には入れない。

| 入れないもの | 理由 |
|---|---|
| ReservationController, CheckInController | 実装上の制御クラスで、業務そのものの概念ではない |
| ReservationForm, MenuView | 画面・UIであり、ドメイン概念ではない |
| ReservationRepository, JsonStorage | 保存方法に関するクラス。概念モデルでなく設計モデルで扱う |
| Database, File | 実装方式に依存するため、ドメイン分析では扱わない |

---

## 5. 概念クラス間の関係

| 関係 | 多重度 | 説明 |
|---|---|---|
| Hotel – Room | Hotel 1 : Room * | 1つのホテルは複数の部屋を持つ。部屋は1つのホテルに属する |
| RoomType – Room | RoomType 1 : Room * | 1つの部屋種別に複数の部屋が属する。各部屋は1つの種別を持つ |
| Customer – Reservation | Customer 1 : Reservation * | 顧客は複数の予約を作れる。予約は1人の顧客に属する |
| Reservation – RoomType | Reservation * : RoomType 1 | 予約時点では部屋番号でなく部屋種別を指定する |
| Reservation – Room | Reservation 0..1 : Room 0..1 | チェックイン前は未割当、チェックイン時に部屋番号が割り当てられる |
| Reservation – Stay | Reservation 1 : Stay 0..1 | チェックインで予約から宿泊が発生。キャンセル時は宿泊なし |
| Stay – Invoice | Stay 1 : Invoice 0..1 | チェックアウト時に請求が作成される |
| Invoice – Payment | Invoice 1 : Payment 0..1 | 請求に対して支払いが行われる。未払いなら支払いなし |
| Staff – Stay | Staff * : Stay * | フロント係は複数のチェックイン/アウトを担当しうる（実装では省略可） |

（TODO: 集約（ホテル⇔部屋など）にすべき関係があれば注記。ロール名を付けたい箇所も記入）

---

## 6. 重要な制約（文章で添える）

- 予約番号は一意である。
- 予約状態が RESERVED の場合のみキャンセルできる。
- 予約状態が RESERVED の場合のみチェックインできる。
- 予約状態が CHECKED_IN の場合のみチェックアウトできる。
- チェックアウトが完了すると、予約状態は CHECKED_OUT になる。
- キャンセル済み予約に対してチェックインはできない。
- 同一期間に同じ部屋を複数の宿泊へ割り当ててはいけない。
- 部屋の定員を超える人数では予約できない。
- 宿泊料は、基本的に「部屋種別の1泊料金 × 宿泊数」で計算する。

（TODO: 追加の業務ルールがあれば追記）

---

## 7. 予約状態の考え方

予約キャンセルを最初から考慮するため、予約状態を必ず導入する。

```
RESERVED   --> CANCELLED
RESERVED   --> CHECKED_IN
CHECKED_IN --> CHECKED_OUT
```

不正な遷移は例外またはエラー表示にする（例：CANCELLED から CHECKED_IN へは遷移不可）。

---

## 8. オブジェクト図の具体例（クラス図の検証用）

- 顧客: 佐藤一郎
- ホテル: Waseda Hotel
- 部屋種別: Single, Twin
- 部屋: 301号室（Single）, 302号室（Single）, 401号室（Twin）
- 予約: R-20260701-001
- 予約期間: 2026-07-10 〜 2026-07-11（1泊）
- 予約状態: RESERVED
- チェックイン後: 301号室が割り当てられ、Stay オブジェクトが発生する
- チェックアウト後: Invoice と Payment が発生し、予約状態が CHECKED_OUT になる

### 文章によるオブジェクト表現

```
sato: Customer            name = "佐藤一郎"
hotel: Hotel              name = "Waseda Hotel"
single: RoomType          name = "Single"  capacity = 1  pricePerNight = 8000
room301: Room             roomNumber = "301"  status = AVAILABLE
reservation001: Reservation
    reservationId = "R-20260701-001"
    checkInDate  = 2026-07-10
    checkOutDate = 2026-07-11
    status       = RESERVED

links:
  hotel        -- room301
  single       -- room301
  sato         -- reservation001
  reservation001 -- single
```

→ この例を `diagrams/object_example.puml` に展開する（Issue `[Domain] オブジェクト図で検証する`）。

---

## 9. 概念クラス図

図の本体は `diagrams/domain_class.puml` に置く（計画書のたたき台がベース）。
ここには、図で表現した意図や、レビューで修正した点をメモする。

（TODO: 図作成後、変更点・レビュー指摘と対応を記録）

---

## 10. レビュー項目（ドメイン分析）

図が完成したら、下記を全員でチェックする。

**全体**
- [ ] 主要な概念および概念間の関係が網羅されている
- [ ] 問題領域の用語表・辞書として機能する
- [ ] 具体的な実装方法の推定になっていない
- [ ] 配置・色・フォントなどが読みやすい

**クラス**
- [ ] 名詞・名詞句・代名詞がクラス/属性として挙げられている
- [ ] 直観的で明確なクラス名がつけられている

**関係**
- [ ] すべての関係が両端を用いて違和感なく読める
- [ ] 汎化・集約の関係に必然性がある
- [ ] 必要に応じて多重度・ロールが用いられている

---

## 11. レビュー記録

| 日付 | 指摘者 | 指摘内容 | 対応 |
|---|---|---|---|
| | | | |

（TODO: レビューのたびに1行ずつ追記。最終レポートの材料になる）
