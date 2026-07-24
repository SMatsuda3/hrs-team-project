// UI rendering layer. Business rules and data handling stay in app.js.

function render(view = "home") {
  if (portal === "staff" && state.role !== "STAFF" && view !== "staffLogin") {
    view = "staffLogin";
  }
  if (portal === "admin" && state.role !== "ADMIN" && view !== "adminLogin") {
    view = "adminLogin";
  }
  if (portal === "customer" && ["staff", "checkin", "checkout", "admin", "hotels", "hotelEdit", "staffLogin", "adminLogin"].includes(view)) {
    view = "home";
  }
  syncHeader(view);
  if (portal === "staff" && state.role === "STAFF" && !["staff", "lookup", "checkin", "checkout"].includes(view)) {
    view = "staff";
  }
  if (portal === "admin" && state.role === "ADMIN" && !["admin", "hotels", "hotelEdit", "lookup"].includes(view)) {
    view = "admin";
  }
  const views = {
    home: renderHome,
    account: renderAccount,
    register: renderRegister,
    results: renderResults,
    reserve: renderReserve,
    complete: renderComplete,
    lookup: renderLookup,
    staffLogin: () => renderPortalLogin("STAFF"),
    adminLogin: () => renderPortalLogin("ADMIN"),
    staff: renderStaff,
    checkin: renderCheckIn,
    checkout: renderCheckOut,
    admin: renderAdmin,
    hotels: renderHotelAdmin,
    hotelEdit: renderHotelEdit
  };
  app.innerHTML = "";
  app.appendChild((views[view] || renderHome)());
}

function renderHome() {
  const root = el("div");
  root.innerHTML = `
    <section class="hero">
      <div class="hero-content">
        <p class="eyebrow">Book direct</p>
        <h1>滞在日を選ぶだけで、最適な部屋をすぐ予約。</h1>
      </div>
    </section>
  `;
  root.appendChild(searchCard());
  root.appendChild(roomIntro());
  return root;
}

function searchCard() {
  const search = state.lastSearch || defaultSearch();
  const regions = locationOptions("region");
  const prefectures = locationOptions("prefecture", { region: search.region });
  const cities = locationOptions("city", { region: search.region, prefecture: search.prefecture });
  const card = el("section", "search-card");
  card.innerHTML = `
    <form id="searchForm" class="search-grid location-search-grid">
      <label>地方
        <select name="region">
          <option value="">すべて</option>
          ${optionList(regions, search.region)}
        </select>
      </label>
      <label>都道府県
        <select name="prefecture">
          <option value="">すべて</option>
          ${optionList(prefectures, search.prefecture)}
        </select>
      </label>
      <label>市区町村
        <select name="city">
          <option value="">すべて</option>
          ${optionList(cities, search.city)}
        </select>
      </label>
      <label>チェックイン<input name="checkInDate" type="date" value="${search.checkInDate}"></label>
      <label>チェックアウト<input name="checkOutDate" type="date" value="${search.checkOutDate}"></label>
      <label>人数<input name="guestCount" type="number" min="1" max="10" value="${search.guestCount}"></label>
      <label>部屋タイプ
        <select name="roomTypeId">
          <option value="">指定なし</option>
          ${roomTypeNameOptions().map((name) => `<option value="${name}" ${search.roomTypeName === name ? "selected" : ""}>${name}</option>`).join("")}
        </select>
      </label>
      <button class="button primary">空室を検索</button>
    </form>
  `;
  const formNode = card.querySelector("#searchForm");
  const regionSelect = formNode.elements.region;
  const prefectureSelect = formNode.elements.prefecture;
  const citySelect = formNode.elements.city;
  const refreshLocationSelects = () => {
    const region = regionSelect.value;
    const prefectureOptions = locationOptions("prefecture", { region });
    if (!prefectureOptions.includes(prefectureSelect.value)) {
      prefectureSelect.value = "";
    }
    prefectureSelect.innerHTML = `<option value="">すべて</option>${optionList(prefectureOptions, prefectureSelect.value)}`;
    const cityOptions = locationOptions("city", { region, prefecture: prefectureSelect.value });
    if (!cityOptions.includes(citySelect.value)) {
      citySelect.value = "";
    }
    citySelect.innerHTML = `<option value="">すべて</option>${optionList(cityOptions, citySelect.value)}`;
  };
  regionSelect.addEventListener("change", refreshLocationSelects);
  prefectureSelect.addEventListener("change", refreshLocationSelects);
  card.querySelector("#searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const query = {
      hotelId: "",
      region: form.get("region"),
      prefecture: form.get("prefecture"),
      city: form.get("city"),
      checkInDate: form.get("checkInDate"),
      checkOutDate: form.get("checkOutDate"),
      guestCount: Number(form.get("guestCount")),
      roomTypeName: form.get("roomTypeId"),
      roomTypeId: ""
    };
    try {
      searchAvailability(query);
      state.lastSearch = query;
      saveState();
      render("results");
    } catch (error) {
      toast(error.message);
    }
  });
  return card;
}

function roomIntro() {
  const section = el("section", "section");
  section.innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Rooms</p>
        <h2>部屋タイプ</h2>
      </div>
    </div>
    <div class="room-grid">
      ${featuredRoomTypes().map(roomTypeCard).join("")}
    </div>
  `;
  return section;
}

function roomTypeCard(type) {
  return `
    <article class="room-card">
      <div class="room-visual ${type.name.toLowerCase()}"></div>
      <div class="room-body">
        <h3>${type.name}</h3>
        <div class="summary-list">
          <div><span>定員</span><strong>${type.capacity}名</strong></div>
          <div><span>1泊料金</span><strong>${yen(type.pricePerNight)}</strong></div>
        </div>
      </div>
    </article>
  `;
}

function renderResults() {
  const root = page("空室検索結果", "");
  const section = el("section", "section");
  const query = state.lastSearch || defaultSearch();
  let results = [];
  try {
    results = sortAvailabilityResults(searchAvailability(query), state.resultSort || "priceAsc");
  } catch (error) {
    section.appendChild(empty(error.message));
    root.appendChild(section);
    return root;
  }
  if (!results.length) {
    section.appendChild(empty("指定条件で空室はありません。日付、人数、部屋タイプを変えて検索してください。"));
  } else {
    const container = el("div", "results");
    results.forEach((result) => {
      const row = el("article", "result-row");
      row.innerHTML = `
        <div class="room-visual ${result.roomTypeName.toLowerCase()}"></div>
        <div>
          <h3>${result.roomTypeName}</h3>
          <strong>${result.hotelName}</strong>
          <div class="result-meta">
            <span class="chip">${hotelLocationText(result.hotelId)}</span>
            <span class="chip">${result.nights}泊</span>
            <span class="chip">${result.guestCount}名</span>
            <span class="chip">空室 ${result.availableRooms}室</span>
            <span class="chip">定員 ${result.capacity}名</span>
          </div>
        </div>
        <div>
          <div class="price">${yen(result.estimatedAmount)}</div>
          <button class="button primary" data-reserve="${result.roomTypeId}" data-hotel="${result.hotelId}">予約へ進む</button>
        </div>
      `;
      container.appendChild(row);
    });
    section.appendChild(container);
  }
  const actions = el("div", "actions results-actions");
  actions.innerHTML = `
    <label class="sort-control">並び替え
      <select id="resultSort">
        <option value="priceAsc" ${state.resultSort === "priceAsc" ? "selected" : ""}>料金が安い順</option>
        <option value="priceDesc" ${state.resultSort === "priceDesc" ? "selected" : ""}>料金が高い順</option>
        <option value="availabilityDesc" ${state.resultSort === "availabilityDesc" ? "selected" : ""}>空室が多い順</option>
        <option value="capacityDesc" ${state.resultSort === "capacityDesc" ? "selected" : ""}>定員が多い順</option>
        <option value="hotelNameAsc" ${state.resultSort === "hotelNameAsc" ? "selected" : ""}>ホテル名順</option>
      </select>
    </label>
    <button class="button secondary" data-view-target="home">条件を変更する</button>
  `;
  section.prepend(actions);
  root.appendChild(section);
  root.querySelector("[data-view-target='home']").addEventListener("click", () => render("home"));
  root.querySelector("#resultSort").addEventListener("change", (event) => {
    state.resultSort = event.currentTarget.value;
    saveState();
    render("results");
  });
  root.querySelectorAll("[data-reserve]").forEach((button) => {
    button.addEventListener("click", () => {
      state.lastSearch.roomTypeId = button.dataset.reserve;
      state.lastSearch.hotelId = button.dataset.hotel;
      state.lastSearch.roomTypeName = "";
      saveState();
      render("reserve");
    });
  });
  return root;
}

function renderReserve() {
  const query = state.lastSearch || defaultSearch();
  const type = state.roomTypes.find((item) => item.roomTypeId === query.roomTypeId);
  if (!type) {
    const root = page("予約情報の入力", "");
    root.appendChild(empty("空室検索結果から予約したい部屋を選択してください。"));
    return root;
  }
  const nights = nightsBetween(query.checkInDate, query.checkOutDate);
  if (state.role !== "USER") {
    const root = page("予約情報の入力", "");
    const layout = el("section", "section");
    layout.innerHTML = `
      <div class="admin-grid">
        <aside class="summary-card">
          <p class="eyebrow">Your stay</p>
          <h2>${type.name}</h2>
          <div class="summary-list">
            <div><span>ホテル</span><strong>${hotelById(query.hotelId).name}</strong></div>
            <div><span>チェックイン</span><strong>${query.checkInDate}</strong></div>
            <div><span>チェックアウト</span><strong>${query.checkOutDate}</strong></div>
            <div><span>人数</span><strong>${query.guestCount}名</strong></div>
            <div><span>宿泊数</span><strong>${nights}泊</strong></div>
            <div><span>料金目安</span><strong>${yen(type.pricePerNight * nights)}</strong></div>
          </div>
        </aside>
        <div class="panel" style="grid-column: span 2;">
          <h2>ログインが必要です</h2>
          <p class="muted">予約内容をアカウントに紐づけるため、ログインまたは新規登録を行ってください。</p>
          <div class="actions" style="margin-top:16px;">
            <button class="button primary" data-view-target="account">ログイン・新規登録へ</button>
            <button class="button ghost" data-view-target="results">検索結果に戻る</button>
          </div>
        </div>
      </div>
    `;
    root.appendChild(layout);
    root.querySelectorAll("[data-view-target]").forEach((button) => {
      button.addEventListener("click", () => render(button.dataset.viewTarget));
    });
    return root;
  }
  const account = currentUserAccount();
  const root = page("予約情報の入力", "");
  const layout = el("section", "section");
  layout.innerHTML = `
    <div class="admin-grid">
      <aside class="summary-card">
        <p class="eyebrow">Your stay</p>
        <h2>${type.name}</h2>
        <div class="summary-list">
          <div><span>ホテル</span><strong>${hotelById(query.hotelId).name}</strong></div>
          <div><span>チェックイン</span><strong>${query.checkInDate}</strong></div>
          <div><span>チェックアウト</span><strong>${query.checkOutDate}</strong></div>
          <div><span>人数</span><strong>${query.guestCount}名</strong></div>
          <div><span>宿泊数</span><strong>${nights}泊</strong></div>
          <div><span>料金目安</span><strong>${yen(type.pricePerNight * nights)}</strong></div>
        </div>
      </aside>
      <form id="reserveForm" class="panel" style="grid-column: span 2;">
        <h2>予約者情報</h2>
        <div class="summary-list">
          <div><span>氏名</span><strong>${escapeHtml(account.name)}</strong></div>
          <div><span>メール</span><strong>${escapeHtml(account.email)}</strong></div>
          <div><span>電話番号</span><strong>${escapeHtml(account.phone)}</strong></div>
        </div>
        <div class="actions" style="margin-top:16px;">
          <button type="button" class="button secondary" data-view="results">条件に戻る</button>
          <button class="button primary">予約を確定する</button>
        </div>
      </form>
    </div>
  `;
  root.appendChild(layout);
  root.querySelector("[data-view='results']").addEventListener("click", () => render("results"));
  root.querySelector("#reserveForm").addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const reservation = reserveRoom();
      state.lastReservationId = reservation.reservationId;
      saveState();
      render("complete");
    } catch (error) {
      toast(error.message);
    }
  });
  return root;
}

function renderComplete() {
  const reservation = state.reservations.find((item) => item.reservationId === state.lastReservationId);
  const root = page("予約が完了しました", "");
  if (!reservation) {
    root.appendChild(empty("直近の予約が見つかりません。"));
    return root;
  }
  const detail = reservationDetails(reservation.reservationId);
  const section = el("section", "section");
  section.innerHTML = `
    <div class="admin-grid">
      <article class="summary-card" style="grid-column: span 3;">
        <p class="eyebrow">Reservation confirmed</p>
        <h2 class="reservation-number">予約番号 ${detail.reservation.reservationId}</h2>
        <div class="summary-list">
          <div><span>代表者</span><strong>${detail.customer.name}</strong></div>
          <div><span>宿泊期間</span><strong>${detail.reservation.checkInDate} - ${detail.reservation.checkOutDate}</strong></div>
          <div><span>部屋タイプ</span><strong>${detail.roomType.name}</strong></div>
          <div><span>料金目安</span><strong>${yen(detail.reservation.baseAmount)}</strong></div>
          <div><span>状態</span><strong>${detail.reservation.status}</strong></div>
        </div>
        <div class="actions" style="margin-top:16px;">
          <button class="button secondary" data-view-target="lookup">予約確認へ</button>
          <button class="button ghost" data-view-target="home">空室検索に戻る</button>
        </div>
      </article>
    </div>
  `;
  root.appendChild(section);
  root.querySelectorAll("[data-view-target]").forEach((button) => {
    button.addEventListener("click", () => render(button.dataset.viewTarget));
  });
  return root;
}

function renderLookup() {
  if (portal === "customer") {
    return renderCustomerReservations();
  }
  const root = portal === "staff"
    ? workspacePage("予約確認", "", staffMenu())
    : workspacePage("予約確認", "", adminMenu());
  root.querySelector(".workspace-main").appendChild(lookupPanel(true));
  return root;
}

function renderAccount() {
  const root = el("div");
  const section = el("section", "section");
  const account = currentUserAccount();
  if (account) {
    section.innerHTML = `
      <div class="admin-grid">
        <article class="summary-card" style="grid-column: span 3;">
          <p class="eyebrow">Signed in</p>
          <h2>${escapeHtml(account.name)}</h2>
          <div class="summary-list">
            <div><span>メール</span><strong>${escapeHtml(account.email)}</strong></div>
            <div><span>電話番号</span><strong>${escapeHtml(account.phone)}</strong></div>
            <div><span>アカウントID</span><strong>${account.accountId}</strong></div>
          </div>
          <div class="actions" style="margin-top:16px;">
            <button class="button primary" data-view-target="lookup">予約確認へ</button>
            <button class="button ghost" data-view-target="home">空室検索へ</button>
          </div>
        </article>
      </div>
    `;
    root.appendChild(section);
    root.querySelectorAll("[data-view-target]").forEach((button) => {
      button.addEventListener("click", () => render(button.dataset.viewTarget));
    });
    return root;
  }
  section.innerHTML = `
    <div class="auth-section">
      <form id="userLoginForm" class="panel auth-panel">
        <p class="eyebrow">Login</p>
        <h2>ログイン</h2>
        <label>メールアドレス<input name="email" type="email" autocomplete="email" required placeholder="taro@example.com"></label>
        <label>パスワード<input name="password" type="password" autocomplete="current-password" required placeholder="user123"></label>
        <button class="button primary">ログイン</button>
        <button type="button" class="text-link" data-view-target="register">アカウントを新しく登録する</button>
      </form>
    </div>
  `;
  root.appendChild(section);
  section.querySelector("[data-view-target='register']").addEventListener("click", () => render("register"));
  section.querySelector("#userLoginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const form = new FormData(event.currentTarget);
      const account = loginUserAccount(form.get("email"), form.get("password"));
      if (!account) {
        throw new Error("メールアドレスまたはパスワードが違います。");
      }
      signIn("USER", account.accountId);
      toast("ログインしました。");
      render("lookup");
    } catch (error) {
      toast(error.message);
    }
  });
  return root;
}

function renderRegister() {
  const root = el("div");
  const section = el("section", "section");
  section.innerHTML = `
    <div class="auth-section">
      <form id="userRegisterForm" class="panel auth-panel auth-panel-wide">
        <p class="eyebrow">Create account</p>
        <h2>新規登録</h2>
        <div class="form-grid">
          <label>氏名<input name="name" autocomplete="name" required placeholder="山田 太郎"></label>
          <label>メールアドレス<input name="email" type="email" autocomplete="email" required placeholder="taro@example.com"></label>
          <label>電話番号<input name="phone" autocomplete="tel" required placeholder="090-0000-0000"></label>
          <label>パスワード<input name="password" type="password" autocomplete="new-password" required></label>
          <label>確認用パスワード<input name="passwordConfirm" type="password" autocomplete="new-password" required></label>
        </div>
        <div class="actions" style="margin-top:16px;">
          <button class="button primary">登録してログイン</button>
          <button type="button" class="button ghost" data-view-target="account">ログインに戻る</button>
        </div>
      </form>
    </div>
  `;
  root.appendChild(section);
  section.querySelector("[data-view-target='account']").addEventListener("click", () => render("account"));
  section.querySelector("#userRegisterForm").addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const account = registerUserAccount(Object.fromEntries(new FormData(event.currentTarget)));
      signIn("USER", account.accountId);
      toast("アカウントを作成しました。");
      render("home");
    } catch (error) {
      toast(error.message);
    }
  });
  return root;
}

function renderPortalLogin(requiredRole) {
  const isAdmin = requiredRole === "ADMIN";
  const root = el("div");
  const section = el("section", "section auth-section");
  section.innerHTML = `
    <form id="operatorLoginForm" class="panel auth-panel">
      <p class="eyebrow">${isAdmin ? "Admin" : "Staff"}</p>
      <h2>${isAdmin ? "管理者ログイン" : "スタッフログイン"}</h2>
      <label>ID<input name="userId" required autocomplete="username" placeholder="${isAdmin ? "admin" : "h001-front"}"></label>
      <label>パスワード<input name="password" type="password" required autocomplete="current-password"></label>
      <button class="button primary">ログイン</button>
      <p class="hint">${isAdmin ? "Admin ID: admin, admin001, manager001 / admin123" : "Staff ID: h001-front / front-h001 など、ホテルごとのフロントIDを使用"}</p>
    </form>
  `;
  root.appendChild(section);
  section.querySelector("#operatorLoginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const form = new FormData(event.currentTarget);
      const operator = authenticateOperator(form.get("userId"), form.get("password"), requiredRole);
      if (!operator) {
        throw new Error("ログイン情報が違います。");
      }
      signIn(operator.role, operator.userId, operator.hotelId);
      toast(isAdmin ? "管理者としてログインしました。" : "スタッフとしてログインしました。");
      render(isAdmin ? "admin" : "staff");
    } catch (error) {
      toast(error.message);
    }
  });
  return root;
}

function staffMenu() {
  return [
    ["予約確認", "lookup"],
    ["チェックイン", "checkin"],
    ["チェックアウト", "checkout"]
  ];
}

function adminMenu() {
  return [
    ["ホテル一覧", "hotels"],
    ["予約確認", "lookup"]
  ];
}

function renderCustomerReservations() {
  const root = page("予約確認", "");
  const section = el("section", "section");
  if (state.role !== "USER") {
    section.innerHTML = `
      <div class="panel">
        <h2>ログインが必要です</h2>
        <p class="muted">予約一覧はアカウントごとに表示します。</p>
        <div class="actions" style="margin-top:16px;">
          <button class="button primary" data-view-target="account">ログイン・新規登録へ</button>
          <button class="button ghost" data-view-target="home">空室検索へ</button>
        </div>
      </div>
    `;
    root.appendChild(section);
    root.querySelectorAll("[data-view-target]").forEach((button) => {
      button.addEventListener("click", () => render(button.dataset.viewTarget));
    });
    return root;
  }
  let details = [];
  try {
    details = reservationDetailsForSignedInUser();
  } catch (error) {
    section.appendChild(empty(error.message));
    root.appendChild(section);
    return root;
  }
  if (!details.length) {
    section.appendChild(empty("このアカウントの予約はまだありません。"));
  } else {
    section.innerHTML = `
      <div class="results">
        ${details.map((detail) => reservationCard(detail, true)).join("")}
      </div>
    `;
  }
  root.appendChild(section);
  root.querySelectorAll("[data-cancel]").forEach((cancelButton) => {
    cancelButton.addEventListener("click", () => {
      try {
        cancelReservation(cancelButton.dataset.cancel);
        saveState();
        toast("予約をキャンセルしました。");
        render("lookup");
      } catch (error) {
        toast(error.message);
      }
    });
  });
  return root;
}

function lookupPanel(allowCancel) {
  const section = el("section", "section");
  const backTarget = portal === "staff" ? "staff" : portal === "admin" ? "admin" : "home";
  const backLabel = portal === "customer" ? "空室検索に戻る" : "トップに戻る";
  section.innerHTML = `
    <form class="panel" id="lookupForm">
      <div class="form-grid">
        <label>予約番号・メール・電話番号<input name="keyword" required placeholder="R-20260703-001 / taro@example.com / 090-0000-0000"></label>
      </div>
      <div class="actions" style="margin-top:16px;">
        <button class="button primary">予約一覧を表示</button>
        <button type="button" class="button ghost" data-view-target="${backTarget}">${backLabel}</button>
      </div>
    </form>
    <div id="lookupResult"></div>
  `;
  section.querySelector("[data-view-target]").addEventListener("click", (event) => render(event.currentTarget.dataset.viewTarget));
  const refreshResults = (keyword) => {
    const details = portal === "staff" ? staffReservationDetailsList(keyword) : reservationDetailsList(keyword);
    section.querySelector("#lookupResult").innerHTML = `
      <section class="section">
        <div class="section-header"><div><h2>予約一覧</h2></div></div>
        <div class="results">
          ${details.map((detail) => reservationCard(detail, allowCancel)).join("")}
        </div>
      </section>
    `;
    section.querySelectorAll("[data-cancel]").forEach((cancelButton) => {
      cancelButton.addEventListener("click", () => {
        try {
          cancelReservation(cancelButton.dataset.cancel);
          saveState();
          toast("予約をキャンセルしました。");
          refreshResults(keyword);
        } catch (error) {
          toast(error.message);
        }
      });
    });
  };
  section.querySelector("#lookupForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const keyword = new FormData(event.currentTarget).get("keyword");
    try {
      refreshResults(keyword);
    } catch (error) {
      section.querySelector("#lookupResult").innerHTML = "";
      toast(error.message);
    }
  });
  return section;
}

function checkInConfirmCard(detail) {
  return `
    <article class="reservation-card">
      <div class="stepper">
        <span class="step done">1 予約読取</span>
        <span class="step active">2 内容確認</span>
        <span class="step">3 部屋番号発行</span>
      </div>
      ${reservationCard(detail, false)}
      <form id="checkInForm" class="panel">
        <h3>チェックイン確認</h3>
        <div class="form-grid">
          <label>基本宿泊料金<input value="${yen(detail.reservation.baseAmount)}（チェックアウト時に精算）" readonly></label>
          <label>部屋タイプ<input value="${detail.roomType.name}" readonly></label>
        </div>
        <div class="actions" style="margin-top:16px;">
          <button class="button primary">チェックインして部屋番号を発行</button>
        </div>
      </form>
    </article>
  `;
}

function checkInCompleteCard(detail) {
  return `
    <article class="reservation-card">
      <div class="stepper">
        <span class="step done">1 予約読取</span>
        <span class="step done">2 内容確認</span>
        <span class="step active">3 部屋番号発行</span>
      </div>
      <p class="eyebrow">Check-in completed</p>
      <h2>部屋番号 ${detail.room.roomNumber}</h2>
      <div class="summary-list">
        <div><span>予約番号</span><strong>${detail.reservation.reservationId}</strong></div>
        <div><span>顧客名</span><strong>${detail.customer.name}</strong></div>
        <div><span>部屋タイプ</span><strong>${detail.roomType.name}</strong></div>
        <div><span>基本料金</span><strong>${yen(detail.reservation.baseAmount)} チェックアウト時に精算</strong></div>
        <div><span>チェックアウト可能時間</span><strong>${detail.reservation.checkOutDate} 07:00 - 11:00</strong></div>
        <div><span>状態</span><strong>${detail.reservation.status}</strong></div>
      </div>
      <div class="actions" style="margin-top:16px;">
        <button class="button secondary" onclick="render('checkout')">チェックアウト画面へ</button>
      </div>
    </article>
  `;
}

function renderStaff() {
  const hotel = currentStaffHotel();
  const reservations = staffReservations();
  const root = workspacePage("フロント業務", "", staffMenu());
  const grid = el("section", "dashboard-grid");
  grid.innerHTML = `
    ${metric("担当ホテル", hotel?.name || "-")}
    ${metric("予約中", reservations.filter((r) => r.status === "RESERVED").length)}
    ${metric("滞在中", reservations.filter((r) => r.status === "CHECKED_IN").length)}
  `;
  root.querySelector(".workspace-main").appendChild(grid);
  return root;
}

function renderCheckIn() {
  const root = workspacePage("チェックイン", "", staffMenu());
  const panel = el("section", "panel");
  panel.innerHTML = `
    <div class="stepper">
      <span class="step active">1 予約読取</span>
      <span class="step">2 内容確認</span>
      <span class="step">3 部屋番号発行</span>
    </div>
    <form id="findReservationForm">
      <div class="form-grid">
        <label>予約番号<input name="reservationId" required placeholder="R-20260703-001"></label>
        <label>確認方法<select name="source"><option>予約番号を聞いた</option><option>予約内容を画面で確認した</option></select></label>
      </div>
      <div class="actions" style="margin-top:16px;">
        <button class="button primary">予約情報を表示</button>
      </div>
    </form>
    <div id="checkInResult"></div>
  `;
  panel.querySelector("#findReservationForm").addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const form = new FormData(event.currentTarget);
      const reservationId = normalizeReservationInput(form.get("reservationId"));
      const detail = reservationDetails(reservationId);
      assertStaffCanAccessReservation(detail.reservation);
      assertReservationTransition(detail.reservation, "checkIn");
      panel.querySelector("#checkInResult").innerHTML = checkInConfirmCard(detail);
      panel.querySelector("#checkInForm").addEventListener("submit", (checkInEvent) => {
        checkInEvent.preventDefault();
        try {
          const checkedIn = checkIn(reservationId);
          saveState();
          panel.querySelector("#checkInResult").innerHTML = checkInCompleteCard(checkedIn);
          toast(`部屋番号 ${checkedIn.room.roomNumber} を発行しました。`);
        } catch (error) {
          toast(error.message);
        }
      });
    } catch (error) {
      toast(error.message);
    }
  });
  root.querySelector(".workspace-main").appendChild(panel);
  return root;
}

function renderCheckOut() {
  const root = workspacePage("チェックアウト", "", staffMenu());
  const panel = el("section", "panel");
  panel.innerHTML = `
    <form id="checkOutForm">
      <div class="form-grid">
        <label>予約番号または部屋番号<input name="reservationKey" required placeholder="R-XXXXXXXX または 301"></label>
        <label>支払い方法<select name="method"><option>cash</option><option>credit card</option><option>electronic money</option></select></label>
      </div>
      <p class="muted">予約時に提示した基本料金と追加料金を、チェックアウト時にまとめて精算します。</p>
      <h3>追加料金</h3>
      <div id="charges" class="form-grid one"></div>
      <div class="actions" style="margin-top:12px;">
        <button type="button" class="button secondary" id="addCharge">追加料金を追加</button>
        <button class="button primary">会計を精算してチェックアウト</button>
      </div>
    </form>
    <div id="checkOutResult"></div>
  `;
  const charges = panel.querySelector("#charges");
  const addChargeRow = () => {
    const row = el("div", "form-grid");
    row.innerHTML = `
      <label>項目<input name="chargeName" placeholder="breakfast"></label>
      <label>金額<input name="chargeAmount" type="number" min="0" value="0"></label>
    `;
    charges.appendChild(row);
  };
  addChargeRow();
  panel.querySelector("#addCharge").addEventListener("click", addChargeRow);
  panel.querySelector("#checkOutForm").addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const form = new FormData(event.currentTarget);
      const names = form.getAll("chargeName");
      const amounts = form.getAll("chargeAmount");
      const chargeInputs = names.map((name, index) => ({ name, amount: Number(amounts[index]) }))
        .filter((charge) => charge.name && charge.amount > 0);
      const invoice = checkOut(normalizeReservationInput(form.get("reservationKey")), chargeInputs, form.get("method"));
      saveState();
      panel.querySelector("#checkOutResult").innerHTML = `
        <article class="reservation-card">
          <h3>チェックアウト完了</h3>
          <div class="summary-list">
            <div><span>請求番号</span><strong>${invoice.invoiceId}</strong></div>
            <div><span>基本料金</span><strong>${yen(invoice.baseAmount)}</strong></div>
            <div><span>追加支払い額</span><strong>${yen(invoice.extraAmount)}</strong></div>
            <div><span>合計支払い額</span><strong>${yen(invoice.totalAmount)}</strong></div>
            <div><span>支払い方法</span><strong>${form.get("method")}</strong></div>
          </div>
        </article>
      `;
      toast("チェックアウトを完了しました。");
    } catch (error) {
      toast(error.message);
    }
  });
  root.querySelector(".workspace-main").appendChild(panel);
  return root;
}

function renderAdmin() {
  const root = workspacePage("管理者画面", "", adminMenu());
  const grid = el("section", "dashboard-grid");
  grid.innerHTML = `
    ${metric("ホテル", state.hotels.length)}
    ${metric("部屋タイプ", state.roomTypes.length)}
    ${metric("部屋", state.rooms.length)}
    ${metric("本日空室数", totalAvailableRooms())}
  `;
  root.querySelector(".workspace-main").appendChild(grid);
  return root;
}

function renderHotelAdmin() {
  const root = workspacePage("ホテル一覧", "", adminMenu());
  const panel = el("section", "panel");
  panel.innerHTML = `
    <div class="section-header">
      <div>
        <h2>登録ホテル</h2>
      </div>
      <button class="button primary" id="addHotel">ホテルを追加</button>
    </div>
    <table>
      <thead><tr><th>ホテルID</th><th>ホテル名</th><th>住所</th><th>部屋タイプ</th><th>部屋数</th><th>本日空室数</th><th></th></tr></thead>
      <tbody>
        ${state.hotels.map((hotel) => `
          <tr>
            <td>${hotel.hotelId}</td>
            <td>${hotel.name}</td>
            <td>${hotel.address || "-"}</td>
            <td>${state.roomTypes.filter((type) => type.hotelId === hotel.hotelId).map((type) => type.name).join(", ") || "-"}</td>
            <td>${state.rooms.filter((room) => room.hotelId === hotel.hotelId).length}室</td>
            <td>${totalAvailableRooms(hotel.hotelId)}室</td>
            <td><button class="button secondary" data-edit-hotel="${hotel.hotelId}">編集</button></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
  panel.querySelector("#addHotel").addEventListener("click", () => {
    state.editingHotelId = "";
    render("hotelEdit");
  });
  panel.querySelectorAll("[data-edit-hotel]").forEach((button) => {
    button.addEventListener("click", () => {
      state.editingHotelId = button.dataset.editHotel;
      render("hotelEdit");
    });
  });
  root.querySelector(".workspace-main").appendChild(panel);
  return root;
}

function renderHotelEdit() {
  const hotel = state.hotels.find((item) => item.hotelId === state.editingHotelId) || {
    hotelId: nextHotelId(),
    name: "",
    region: "",
    prefecture: "",
    city: "",
    address: "",
    description: ""
  };
  const types = state.roomTypes.filter((type) => type.hotelId === hotel.hotelId);
  const rooms = state.rooms.filter((room) => room.hotelId === hotel.hotelId);
  const root = workspacePage(hotel.name ? `${hotel.name} の編集` : "ホテルを追加", "", [
    ["ホテル一覧に戻る", "hotels"],
    ["予約確認", "lookup"]
  ]);
  const panel = el("section", "panel");
  panel.innerHTML = `
    <form id="hotelEditForm">
      <h2>ホテル基本情報</h2>
      <div class="internal-note">内部ホテルID: <strong>${hotel.hotelId}</strong></div>
      <div class="form-grid">
        <label>ホテル名<input name="name" value="${escapeHtml(hotel.name)}" required></label>
        <label>地方<input name="region" value="${escapeHtml(hotel.region || "")}" required placeholder="関東"></label>
        <label>都道府県<input name="prefecture" value="${escapeHtml(hotel.prefecture || "")}" required placeholder="東京都"></label>
        <label>市区町村<input name="city" value="${escapeHtml(hotel.city || "")}" required placeholder="新宿区"></label>
        <label>住所<input name="address" value="${escapeHtml(hotel.address || "")}" required></label>
        <label>説明<textarea name="description" rows="3">${escapeHtml(hotel.description || "")}</textarea></label>
      </div>

      <div class="section-header">
        <div>
          <h2>部屋タイプ</h2>
        </div>
        <button type="button" class="button secondary" id="addType">部屋タイプを追加</button>
      </div>
      <div id="typeRows" class="editable-list"></div>

      <div class="section-header">
        <div>
          <h2>部屋番号</h2>
        </div>
        <button type="button" class="button secondary" id="addRoom">部屋番号を追加</button>
      </div>
      <div id="roomRows" class="editable-list"></div>

      <div class="actions" style="margin-top:18px;">
        <button type="button" class="button ghost" data-view-target="hotels">ホテル一覧に戻る</button>
        <button class="button primary">保存する</button>
      </div>
    </form>
  `;
  root.querySelector(".workspace-main").appendChild(panel);
  const typeRows = panel.querySelector("#typeRows");
  const roomRows = panel.querySelector("#roomRows");
  const addType = (type = {}) => {
    const row = el("div", "editable-row type-row");
    const typeId = type.roomTypeId || nextRoomTypeId(hotel.hotelId, typeRows.children.length + 1);
    row.innerHTML = `
      <label>タイプID（内部）<input name="roomTypeId" value="${typeId}" readonly></label>
      <label>名称<select name="typeName" required>${ROOM_TYPE_NAMES.map((name) => `<option value="${name}" ${type.name === name ? "selected" : ""}>${name}</option>`).join("")}</select></label>
      <label>定員<input name="capacity" type="number" min="1" value="${type.capacity || 1}" required></label>
      <label>1泊料金<input name="pricePerNight" type="number" min="0" value="${type.pricePerNight || 8000}" required></label>
      <button type="button" class="button ghost remove-row">削除</button>
    `;
    row.querySelector(".remove-row").addEventListener("click", () => {
      row.remove();
      refreshRoomTypeSelects();
    });
    row.querySelector("[name='typeName']").addEventListener("change", refreshRoomTypeSelects);
    typeRows.appendChild(row);
    refreshRoomTypeSelects();
  };
  const addRoom = (room = {}) => {
    const row = el("div", "editable-row room-row");
    const roomId = room.roomId || nextRoomId(roomRows.children.length + 1);
    row.innerHTML = `
      <label>部屋ID（内部）<input name="roomId" value="${roomId}" readonly></label>
      <label>部屋番号<input name="roomNumber" value="${escapeHtml(room.roomNumber || "")}" placeholder="301" required></label>
      <label>部屋タイプ<select name="roomTypeIdForRoom" data-selected="${room.roomTypeId || ""}" required></select></label>
      <label>状態<select name="roomStatus">
        ${["AVAILABLE", "OCCUPIED", "OUT_OF_SERVICE"].map((status) => `<option ${room.status === status ? "selected" : ""}>${status}</option>`).join("")}
      </select></label>
      <button type="button" class="button ghost remove-row">削除</button>
    `;
    row.querySelector(".remove-row").addEventListener("click", () => row.remove());
    roomRows.appendChild(row);
    refreshRoomTypeSelects();
  };
  const currentTypeChoices = () => [...typeRows.querySelectorAll(".type-row")].map((row) => ({
    roomTypeId: row.querySelector("[name='roomTypeId']").value.trim(),
    name: row.querySelector("[name='typeName']").value
  })).filter((type) => type.roomTypeId);
  const refreshRoomTypeSelects = () => {
    const choices = currentTypeChoices();
    roomRows.querySelectorAll("[name='roomTypeIdForRoom']").forEach((select) => {
      const selected = select.value || select.dataset.selected || choices[0]?.roomTypeId || "";
      select.innerHTML = choices.map((type) => `<option value="${type.roomTypeId}" ${selected === type.roomTypeId ? "selected" : ""}>${type.name} (${type.roomTypeId})</option>`).join("");
      select.dataset.selected = select.value;
    });
  };
  (types.length ? types : [{}]).forEach(addType);
  (rooms.length ? rooms : [{}]).forEach(addRoom);
  panel.querySelector("#addType").addEventListener("click", () => addType());
  panel.querySelector("#addRoom").addEventListener("click", () => addRoom());
  panel.querySelector("[data-view-target='hotels']").addEventListener("click", () => render("hotels"));
  panel.querySelector("#hotelEditForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const hotelId = hotel.hotelId;
    const previousHotelId = state.editingHotelId;
    const savedHotel = {
      hotelId,
      name: form.get("name").trim(),
      region: form.get("region").trim(),
      prefecture: form.get("prefecture").trim(),
      city: form.get("city").trim(),
      address: form.get("address").trim(),
      description: form.get("description").trim()
    };
    if (!savedHotel.region || !savedHotel.prefecture || !savedHotel.city || !savedHotel.address) {
      toast("地域、都道府県、市区町村、住所を入力してください。");
      return;
    }
    state.hotels = state.hotels.filter((item) => item.hotelId !== previousHotelId && item.hotelId !== hotelId);
    state.hotels.push(savedHotel);
    const typeData = [...typeRows.querySelectorAll(".type-row")].map((row) => ({
      roomTypeId: row.querySelector("[name='roomTypeId']").value.trim(),
      hotelId,
      name: row.querySelector("[name='typeName']").value.trim(),
      capacity: Number(row.querySelector("[name='capacity']").value),
      pricePerNight: Number(row.querySelector("[name='pricePerNight']").value)
    })).filter((type) => type.roomTypeId && type.name);
    const roomData = [...roomRows.querySelectorAll(".room-row")].map((row) => ({
      roomId: row.querySelector("[name='roomId']").value.trim(),
      hotelId,
      roomNumber: row.querySelector("[name='roomNumber']").value.trim(),
      roomTypeId: row.querySelector("[name='roomTypeIdForRoom']").value.trim(),
      status: row.querySelector("[name='roomStatus']").value
    })).filter((room) => room.roomId && room.roomNumber);
    state.roomTypes = state.roomTypes.filter((type) => type.hotelId !== previousHotelId && type.hotelId !== hotelId).concat(typeData);
    state.rooms = state.rooms.filter((room) => room.hotelId !== previousHotelId && room.hotelId !== hotelId).concat(roomData);
    state.editingHotelId = hotelId;
    saveState();
    toast("ホテル情報を保存しました。");
    render("hotels");
  });
  return root;
}

function workspacePage(title, subtitle, menu) {
  const root = el("div", "layout section");
  const side = el("aside", "side-panel");
  side.innerHTML = menu.map(([label, view]) => `<button class="button ghost" data-workspace-view="${view}">${label}</button>`).join("");
  const main = el("div", "workspace-main");
  main.appendChild(pageHeader(title, subtitle));
  root.append(side, main);
  side.querySelectorAll("[data-workspace-view]").forEach((button) => {
    button.addEventListener("click", () => render(button.dataset.workspaceView));
  });
  return root;
}

function page(title, subtitle) {
  const root = el("div");
  const section = el("section", "section");
  section.appendChild(pageHeader(title, subtitle));
  root.appendChild(section);
  return root;
}

function pageHeader(title, subtitle) {
  const header = el("div", "section-header");
  header.innerHTML = `<div><h2>${title}</h2></div>`;
  return header;
}

function reservationCard(detail, allowCancel) {
  const cancelAction = allowCancel && detail.reservation.status === "RESERVED"
    ? `<button class="button danger" data-cancel="${detail.reservation.reservationId}">キャンセル実行</button>`
    : "";
  return `
    <article class="reservation-card">
      <div class="section-header">
        <div>
          <p class="eyebrow">Reservation</p>
          <h2>${detail.reservation.reservationId}</h2>
        </div>
        <span class="status">${detail.reservation.status}</span>
      </div>
      <div class="summary-list">
        <div><span>顧客名</span><strong>${detail.customer.name}</strong></div>
        <div><span>メール</span><strong>${detail.customer.email}</strong></div>
        <div><span>ホテル</span><strong>${detail.hotel.name}</strong></div>
        <div><span>部屋タイプ</span><strong>${detail.roomType.name}</strong></div>
        <div><span>部屋番号</span><strong>${detail.room?.roomNumber || "未割当"}</strong></div>
        <div><span>宿泊期間</span><strong>${detail.reservation.checkInDate} - ${detail.reservation.checkOutDate}</strong></div>
        <div><span>人数</span><strong>${detail.reservation.guestCount}名</strong></div>
        <div><span>基本料金</span><strong>${yen(detail.reservation.baseAmount)}</strong></div>
        <div><span>会計状態</span><strong>${detail.reservation.basePaid ? "精算済み" : "チェックアウト時に精算"}</strong></div>
        ${detail.reservation.cancelledAt ? `<div><span>キャンセル日時</span><strong>${new Date(detail.reservation.cancelledAt).toLocaleString("ja-JP")}</strong></div>` : ""}
      </div>
      <div class="actions" style="margin-top:16px;">${cancelAction}</div>
    </article>
  `;
}

function metric(label, value) {
  return `<article class="metric"><p class="muted">${label}</p><h2>${value}</h2></article>`;
}

function empty(message) {
  const div = el("div", "empty");
  div.textContent = message;
  return div;
}

function syncHeader(view) {
  const guestNav = document.querySelector(".guest-nav");
  rolePill.classList.add("hidden");
  if (portal === "customer") {
    const account = currentUserAccount();
    loginButton.textContent = "ログイン";
    loginButton.classList.toggle("hidden", Boolean(account));
    logoutButton.classList.toggle("hidden", !account);
    guestNav?.classList.remove("hidden");
  } else {
    const requiredRole = portal === "admin" ? "ADMIN" : "STAFF";
    const signedIn = state.role === requiredRole;
    loginButton.textContent = portal === "admin" ? "管理者ログイン" : "スタッフログイン";
    loginButton.classList.add("hidden");
    logoutButton.classList.toggle("hidden", !signedIn);
    guestNav?.classList.add("hidden");
  }
  document.querySelectorAll(".nav-link").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function yen(amount) {
  return `${Number(amount).toLocaleString("ja-JP")}円`;
}

function optionList(options, selectedValue) {
  return options
    .map((value) => `<option value="${escapeHtml(value)}" ${value === selectedValue ? "selected" : ""}>${escapeHtml(value)}</option>`)
    .join("");
}

function hotelLocationText(hotelId) {
  const hotel = hotelById(hotelId);
  return [hotel.region, hotel.prefecture, hotel.city].filter(Boolean).join(" / ") || "所在地未設定";
}

function sortAvailabilityResults(results, sortKey) {
  const sorted = [...results];
  const sorters = {
    priceAsc: (a, b) => a.estimatedAmount - b.estimatedAmount || a.hotelName.localeCompare(b.hotelName, "ja"),
    priceDesc: (a, b) => b.estimatedAmount - a.estimatedAmount || a.hotelName.localeCompare(b.hotelName, "ja"),
    availabilityDesc: (a, b) => b.availableRooms - a.availableRooms || a.estimatedAmount - b.estimatedAmount,
    capacityDesc: (a, b) => b.capacity - a.capacity || a.estimatedAmount - b.estimatedAmount,
    hotelNameAsc: (a, b) => a.hotelName.localeCompare(b.hotelName, "ja") || a.estimatedAmount - b.estimatedAmount
  };
  return sorted.sort(sorters[sortKey] || sorters.priceAsc);
}

function el(tag, className = "") {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function toast(message) {
  const node = document.querySelector("#toast");
  node.textContent = message;
  node.classList.remove("hidden");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.add("hidden"), 3200);
}
