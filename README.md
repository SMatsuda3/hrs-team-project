# HRS - Hotel Reservation System（ホテル予約システム）

ソフトウェア工学A チーム課題。3人チームで、提供コードを使わず一から開発する。
分析・設計・実装・保守・発表までを一貫して行い、各機能が UML モデルと対応して説明できる状態を目指す。

開発は **VS Code + GitHub + AI支援コーディング** を前提とする。
AI にコードを書かせる前に、ドメイン・要求・システム分析・アーキテクチャ方針を先に固める。

---

## 対象業務

ホテルの予約から退室までを扱う。予約 → 予約確認 → チェックイン → チェックアウト → 予約キャンセル。

## 実装する機能（CUI）

```
=== Hotel Reservation System ===
1. 空室を検索する
2. 部屋を予約する
3. 予約を確認する
4. チェックインする
5. チェックアウトする
6. 予約をキャンセルする
7. 部屋情報を管理する（余裕があれば）
0. 終了
```

必須：空室検索・予約・予約確認・チェックイン・チェックアウト・予約キャンセル。
部屋情報管理は任意。省略する場合も初期データとして部屋・部屋種別を用意する。

---

## アーキテクチャ

UI 変更や要求追加に強い多層アーキテクチャを採用する。

| 層 | 役割 | 依存してよい先 |
|---|---|---|
| ui | CUI のメニュー・入力・表示 | application |
| application | ユースケースの流れを制御 | domain, Repositoryインタフェース |
| domain | 業務データと業務ルール | （他層に依存しない） |
| infrastructure | JSON/SQLite などへの保存・読込 | domain, Repositoryインタフェース |

**依存方向**

```
ui            --> application
application   --> domain
application   --> Repository Interface
infrastructure--> Repository Interface
infrastructure--> domain
domain        --> どの層にも依存しない
```

保存方式は Repository インタフェースで抽象化し、まず JSON または SQLite で実装、
後から MySQL などに差し替え可能な設計にする。

---

## 予約の状態遷移

予約状態：`RESERVED` / `CANCELLED` / `CHECKED_IN` / `CHECKED_OUT`
不正な状態遷移はエラーにする。

| 現在状態 | 操作 | 結果 |
|---|---|---|
| RESERVED | cancel | CANCELLED |
| RESERVED | checkIn | CHECKED_IN |
| RESERVED | checkOut | エラー |
| CANCELLED | checkIn | エラー |
| CHECKED_IN | checkOut | CHECKED_OUT |
| CHECKED_IN | cancel | エラー |
| CHECKED_OUT | cancel / checkOut | エラー / 完了済み |

---

## リポジトリ構成

```
hrs-team-project/
├── README.md
├── docs/
│   ├── 01_domain_analysis.md      演習1：ドメイン分析
│   ├── 02_requirements.md         演習2：要求分析（全UC記述）
│   ├── 03_system_analysis.md      演習3：BCE分類・相互作用・分析クラス図
│   ├── 04_architecture.md         演習4：アーキテクチャ・技術選定理由
│   └── 05_test_plan.md            テスト計画（正常系・異常系・状態遷移）
├── diagrams/
│   ├── domain_class.puml          概念クラス図
│   ├── object_example.puml        オブジェクト図
│   ├── usecase.puml               ユースケース図
│   └── package.puml               パッケージ図
├── src/
│   ├── ui/                        CUI（入力・表示のみ）
│   ├── application/               ユースケース（○○UseCase）
│   ├── domain/                    業務データ・業務ルール
│   └── infrastructure/            保存・読込、Repository実装
├── tests/                         単体・ユースケース・デモテスト
└── demo/
    ├── demo_script.md             デモ手順（入力値・期待出力・説明順）
    └── sample_data.json           初期データ
```

---

## 主要クラス

- **domain**: Customer, RoomType, Room, Reservation, Stay, Invoice, Payment
  - Reservation は `cancel()`, `checkIn(room)`, `checkOut()` を持ち、状態遷移をクラス内部で保証する
- **application**: SearchAvailabilityUseCase, ReserveRoomUseCase, ConfirmReservationUseCase,
  CheckInUseCase, CheckOutUseCase, CancelReservationUseCase
- **infrastructure**: ReservationRepository / RoomRepository（インタフェース）,
  JsonReservationRepository / JsonRoomRepository（実装）
- **ui**: MainMenu, ReservationCli, CheckInCli, CheckOutCli, CancelCli

---

## Issue の切り方

「UIを作る」のような縦割りではなく、**ユースケース・成果物単位**で切る（各Issueがユーザー価値に対応する）。

- `[Domain]` 概念クラス候補を整理する / 概念クラス図を作成する / オブジェクト図で検証する
- `[Req]` ユースケース図を作成する / 全ユースケース記述を作成する
- `[Analysis]` BCE分類を作成する
- `[Arch]` パッケージ図を作成する
- `[Impl]` ドメイン層 / 予約UC / チェックイン・チェックアウト / キャンセル機能を実装する
- `[Test]` 正常系・異常系テストを作る
- `[Demo]` 発表用デモ手順を固定する

---

## 担当

| 担当 | 主な責任 |
|---|---|
| A | ドメイン・保守：概念/オブジェクト図、予約状態、キャンセル影響分析、保守説明 |
| B | 要求・設計：ユースケース図、全UC記述、BCE分類、パッケージ図、発表構成 |
| C | 実装・デモ：開発環境、Domain層、UseCase層、CUI、保存、テスト、デモ手順 |
| 全員 | レビュー：図とコードの整合性確認、Issue確認、発表リハーサル |

分業しすぎず、各自が担当外の図やコードもレビューする。

---

## スケジュール（目安）

| Day | やること |
|---|---|
| 1 | リポジトリ作成、Issue登録、役割分担、ドメインクラス候補整理 |
| 2 | ドメインクラス図、オブジェクト図、ユースケース図、全UC記述 |
| 3 | BCE分類、相互作用、分析クラス図、パッケージ図 |
| 4 | 実装言語決定、Domain層とRepository方針を実装、テスト開始 |
| 5 | 予約・確認・チェックイン・チェックアウトを実装 |
| 6 | キャンセル実装、異常系テスト、デモ手順固定 |
| 7 | 発表資料作成、3分発表練習、レポート用メモ整理 |

---

## AI支援コーディングの進め方

いきなり「ホテル予約システムを作って」と依頼しない。次の順で進める。

1. ドメインモデル・UC記述・アーキテクチャ方針を AI に読ませる
2. 実装言語を指定し、ディレクトリ構成を生成させる（まだコードは出させない）
3. Domain層 → Application層（UseCase）→ CUI の順に実装させる
4. 生成コードを UC記述とレビュー項目に照らして人間が確認・修正する

---

## 最重要チェックリスト

- [ ] ドメイン分析に実装クラス（Controller等）を混ぜていない
- [ ] 全UCに事前条件・事後条件・基本系列・例外系列がある
- [ ] 予約キャンセルを後付けでなく状態遷移として扱っている
- [ ] Boundary / Control / Entity の責務が混ざっていない
- [ ] UI層が業務ロジックを持っていない
- [ ] Domain層がUIや保存形式に依存していない
- [ ] Repositoryで保存方式を差し替え可能にしている
- [ ] CUIで主要ユースケースを連続してデモできる
- [ ] 異常系の動作を最低限確認している
- [ ] GitHub Issues と成果物が対応している
- [ ] AI生成コードを設計モデルとレビュー項目に照らして確認した
