const STORAGE_KEY = "hrs-web-state-v2";

const EXTRA_HOTELS = [
  { hotelId: "H006", name: "Osaka Namba Grand Hotel", region: "関西", prefecture: "大阪府", city: "大阪市", address: "大阪府大阪市中央区難波3-5-1", description: "A lively hotel close to Namba dining and shopping areas." },
  { hotelId: "H007", name: "Umeda Business Hotel", region: "関西", prefecture: "大阪府", city: "大阪市", address: "大阪府大阪市北区梅田1-1-3", description: "A practical business hotel with convenient rail access." },
  { hotelId: "H008", name: "Kobe Harbor Hotel", region: "関西", prefecture: "兵庫県", city: "神戸市", address: "兵庫県神戸市中央区波止場町2-2", description: "A harbor-side hotel for relaxed city stays." },
  { hotelId: "H009", name: "Nara Park View Hotel", region: "関西", prefecture: "奈良県", city: "奈良市", address: "奈良県奈良市登大路町40", description: "A calm hotel near Nara Park and historical sites." },
  { hotelId: "H010", name: "Nagoya Station Hotel", region: "中部", prefecture: "愛知県", city: "名古屋市", address: "愛知県名古屋市中村区名駅1-1-4", description: "A station-front hotel for business and sightseeing." },
  { hotelId: "H011", name: "Kanazawa Castle Hotel", region: "中部", prefecture: "石川県", city: "金沢市", address: "石川県金沢市丸の内1-1", description: "A city hotel near gardens, museums, and castle areas." },
  { hotelId: "H012", name: "Mt Fuji Lake Hotel", region: "中部", prefecture: "山梨県", city: "富士河口湖町", address: "山梨県南都留郡富士河口湖町船津1", description: "A lakeside hotel with views toward Mt. Fuji." },
  { hotelId: "H013", name: "Niigata Riverside Hotel", region: "中部", prefecture: "新潟県", city: "新潟市", address: "新潟県新潟市中央区万代5-11-20", description: "A riverside hotel for work trips and weekend stays." },
  { hotelId: "H014", name: "Yokohama Minato Hotel", region: "関東", prefecture: "神奈川県", city: "横浜市", address: "神奈川県横浜市西区みなとみらい2-2-1", description: "A modern hotel in the Minato Mirai area." },
  { hotelId: "H015", name: "Kamakura Seaside Inn", region: "関東", prefecture: "神奈川県", city: "鎌倉市", address: "神奈川県鎌倉市由比ガ浜4-1-1", description: "A compact seaside inn for leisure stays." },
  { hotelId: "H016", name: "Chiba Bay Hotel", region: "関東", prefecture: "千葉県", city: "千葉市", address: "千葉県千葉市美浜区ひび野2-120", description: "A bay-area hotel suitable for family trips." },
  { hotelId: "H017", name: "Saitama Urban Hotel", region: "関東", prefecture: "埼玉県", city: "さいたま市", address: "埼玉県さいたま市大宮区桜木町1-7-5", description: "An urban hotel near the central business district." },
  { hotelId: "H018", name: "Sendai Aoba Hotel", region: "東北", prefecture: "宮城県", city: "仙台市", address: "宮城県仙台市青葉区中央1-1-1", description: "A central Sendai hotel for shopping and business." },
  { hotelId: "H019", name: "Aomori Station Hotel", region: "東北", prefecture: "青森県", city: "青森市", address: "青森県青森市柳川1-1-1", description: "A station-side hotel for northern Japan travel." },
  { hotelId: "H020", name: "Morioka Central Hotel", region: "東北", prefecture: "岩手県", city: "盛岡市", address: "岩手県盛岡市盛岡駅前通1-44", description: "A central hotel for business and local dining." },
  { hotelId: "H021", name: "Hiroshima Peace Hotel", region: "中国", prefecture: "広島県", city: "広島市", address: "広島県広島市中区中島町1-1", description: "A city hotel close to parks and tram access." },
  { hotelId: "H022", name: "Okayama Korakuen Hotel", region: "中国", prefecture: "岡山県", city: "岡山市", address: "岡山県岡山市北区後楽園1-5", description: "A comfortable hotel near Korakuen garden." },
  { hotelId: "H023", name: "Matsue Lake Hotel", region: "中国", prefecture: "島根県", city: "松江市", address: "島根県松江市千鳥町30", description: "A lakeside hotel for quiet stays and sightseeing." },
  { hotelId: "H024", name: "Takamatsu Port Hotel", region: "四国", prefecture: "香川県", city: "高松市", address: "香川県高松市サンポート2-1", description: "A port-area hotel for island and city travel." },
  { hotelId: "H025", name: "Matsuyama Castle Hotel", region: "四国", prefecture: "愛媛県", city: "松山市", address: "愛媛県松山市丸之内1", description: "A hotel near castle views and local shopping streets." },
  { hotelId: "H026", name: "Fukuoka Tenjin Hotel", region: "九州", prefecture: "福岡県", city: "福岡市", address: "福岡県福岡市中央区天神2-1-1", description: "A hotel in the Tenjin area for business and dining." },
  { hotelId: "H027", name: "Nagasaki Harbor Hotel", region: "九州", prefecture: "長崎県", city: "長崎市", address: "長崎県長崎市尾上町1-1", description: "A harbor hotel with convenient city access." },
  { hotelId: "H028", name: "Kumamoto Castle Hotel", region: "九州", prefecture: "熊本県", city: "熊本市", address: "熊本県熊本市中央区本丸1-1", description: "A city hotel near Kumamoto Castle." },
  { hotelId: "H029", name: "Kagoshima Tenmonkan Hotel", region: "九州", prefecture: "鹿児島県", city: "鹿児島市", address: "鹿児島県鹿児島市千日町1-1", description: "A downtown hotel close to dining and tram stops." },
  { hotelId: "H030", name: "Okinawa Naha Resort", region: "沖縄", prefecture: "沖縄県", city: "那覇市", address: "沖縄県那覇市久茂地1-1-1", description: "A resort-style hotel for Okinawa city stays." }
];

const EXTRA_ACCOUNTS = [
  { accountId: "U002", customerId: "C002", name: "佐藤 花子", email: "hanako@example.com", phone: "080-1111-2222", password: "user123", createdAt: "2026-07-02T09:00:00.000Z" },
  { accountId: "U003", customerId: "C003", name: "鈴木 一郎", email: "ichiro@example.com", phone: "080-3333-4444", password: "user123", createdAt: "2026-07-03T09:00:00.000Z" },
  { accountId: "U004", customerId: "C004", name: "高橋 美咲", email: "misaki@example.com", phone: "080-5555-6666", password: "user123", createdAt: "2026-07-04T09:00:00.000Z" },
  { accountId: "U005", customerId: "C005", name: "田中 健", email: "ken@example.com", phone: "080-7777-8888", password: "user123", createdAt: "2026-07-05T09:00:00.000Z" }
];

function buildExtraRoomTypes(hotels) {
  const thirdTypeCycle = ["Deluxe", "Suite", "Family"];
  return hotels.flatMap((hotel, hotelIndex) => {
    const thirdName = thirdTypeCycle[hotelIndex % thirdTypeCycle.length];
    const base = 7800 + hotelIndex * 350;
    return [
      { roomTypeId: `RT_${hotel.hotelId}_SINGLE`, hotelId: hotel.hotelId, name: "Single", capacity: 1, pricePerNight: base },
      { roomTypeId: `RT_${hotel.hotelId}_TWIN`, hotelId: hotel.hotelId, name: "Twin", capacity: 2, pricePerNight: base + 6200 },
      { roomTypeId: `RT_${hotel.hotelId}_${thirdName.toUpperCase()}`, hotelId: hotel.hotelId, name: thirdName, capacity: thirdName === "Family" ? 5 : thirdName === "Suite" ? 4 : 3, pricePerNight: base + 15000 }
    ];
  });
}

function buildExtraRooms(hotels) {
  const thirdTypeCycle = ["Deluxe", "Suite", "Family"];
  return hotels.flatMap((hotel, hotelIndex) => {
    const thirdName = thirdTypeCycle[hotelIndex % thirdTypeCycle.length];
    const thirdRoomTypeId = `RT_${hotel.hotelId}_${thirdName.toUpperCase()}`;
    return [
      { roomId: `RM_${hotel.hotelId}_101`, hotelId: hotel.hotelId, roomNumber: "101", roomTypeId: `RT_${hotel.hotelId}_SINGLE`, status: "AVAILABLE" },
      { roomId: `RM_${hotel.hotelId}_102`, hotelId: hotel.hotelId, roomNumber: "102", roomTypeId: `RT_${hotel.hotelId}_SINGLE`, status: "AVAILABLE" },
      { roomId: `RM_${hotel.hotelId}_201`, hotelId: hotel.hotelId, roomNumber: "201", roomTypeId: `RT_${hotel.hotelId}_TWIN`, status: "AVAILABLE" },
      { roomId: `RM_${hotel.hotelId}_202`, hotelId: hotel.hotelId, roomNumber: "202", roomTypeId: `RT_${hotel.hotelId}_TWIN`, status: "AVAILABLE" },
      { roomId: `RM_${hotel.hotelId}_301`, hotelId: hotel.hotelId, roomNumber: "301", roomTypeId: thirdRoomTypeId, status: "AVAILABLE" }
    ];
  });
}

const seedState = {
  role: "GUEST",
  signedInUserId: "",
  accounts: [
    {
      accountId: "U001",
      customerId: "C001",
      name: "山田 太郎",
      email: "taro@example.com",
      phone: "090-0000-0000",
      password: "user123",
      createdAt: "2026-07-01T09:00:00.000Z"
    },
    ...EXTRA_ACCOUNTS
  ],
  hotels: [
    { hotelId: "H001", name: "Waseda Hotel", region: "関東", prefecture: "東京都", city: "新宿区", address: "東京都新宿区西早稲田1-6-1", description: "A quiet city hotel near the campus area." },
    { hotelId: "H002", name: "Shinjuku Garden Hotel", region: "関東", prefecture: "東京都", city: "新宿区", address: "東京都新宿区新宿3-38-1", description: "A business hotel with easy station access." },
    { hotelId: "H003", name: "Bay View Hotel", region: "関東", prefecture: "東京都", city: "江東区", address: "東京都江東区青海1-1-10", description: "A relaxed waterfront hotel for family stays." },
    { hotelId: "H004", name: "Kyoto Riverside Hotel", region: "関西", prefecture: "京都府", city: "京都市", address: "京都府京都市下京区東塩小路町901", description: "A calm riverside hotel for sightseeing stays." },
    { hotelId: "H005", name: "Sapporo North Hotel", region: "北海道", prefecture: "北海道", city: "札幌市", address: "北海道札幌市中央区北5条西2丁目", description: "A city hotel close to Sapporo station." },
    ...EXTRA_HOTELS
  ],
  roomTypes: [
    { roomTypeId: "RT_SINGLE", hotelId: "H001", name: "Single", capacity: 1, pricePerNight: 8000 },
    { roomTypeId: "RT_TWIN", hotelId: "H001", name: "Twin", capacity: 2, pricePerNight: 14000 },
    { roomTypeId: "RT_DELUXE", hotelId: "H001", name: "Deluxe", capacity: 3, pricePerNight: 22000 },
    { roomTypeId: "RT_H002_SINGLE", hotelId: "H002", name: "Single", capacity: 1, pricePerNight: 9000 },
    { roomTypeId: "RT_H002_TWIN", hotelId: "H002", name: "Twin", capacity: 2, pricePerNight: 16000 },
    { roomTypeId: "RT_H002_SUITE", hotelId: "H002", name: "Suite", capacity: 4, pricePerNight: 36000 },
    { roomTypeId: "RT_H003_TWIN", hotelId: "H003", name: "Twin", capacity: 2, pricePerNight: 15000 },
    { roomTypeId: "RT_H003_FAMILY", hotelId: "H003", name: "Family", capacity: 5, pricePerNight: 30000 },
    { roomTypeId: "RT_H003_DELUXE", hotelId: "H003", name: "Deluxe", capacity: 3, pricePerNight: 26000 },
    { roomTypeId: "RT_H004_TWIN", hotelId: "H004", name: "Twin", capacity: 2, pricePerNight: 18000 },
    { roomTypeId: "RT_H004_DELUXE", hotelId: "H004", name: "Deluxe", capacity: 3, pricePerNight: 28000 },
    { roomTypeId: "RT_H005_SINGLE", hotelId: "H005", name: "Single", capacity: 1, pricePerNight: 8500 },
    { roomTypeId: "RT_H005_TWIN", hotelId: "H005", name: "Twin", capacity: 2, pricePerNight: 14500 },
    ...buildExtraRoomTypes(EXTRA_HOTELS)
  ],
  rooms: [
    { roomId: "RM301", hotelId: "H001", roomNumber: "301", roomTypeId: "RT_SINGLE", status: "AVAILABLE" },
    { roomId: "RM302", hotelId: "H001", roomNumber: "302", roomTypeId: "RT_SINGLE", status: "AVAILABLE" },
    { roomId: "RM401", hotelId: "H001", roomNumber: "401", roomTypeId: "RT_TWIN", status: "AVAILABLE" },
    { roomId: "RM402", hotelId: "H001", roomNumber: "402", roomTypeId: "RT_TWIN", status: "AVAILABLE" },
    { roomId: "RM501", hotelId: "H001", roomNumber: "501", roomTypeId: "RT_DELUXE", status: "AVAILABLE" },
    { roomId: "RM2101", hotelId: "H002", roomNumber: "101", roomTypeId: "RT_H002_SINGLE", status: "AVAILABLE" },
    { roomId: "RM2102", hotelId: "H002", roomNumber: "102", roomTypeId: "RT_H002_SINGLE", status: "AVAILABLE" },
    { roomId: "RM2201", hotelId: "H002", roomNumber: "201", roomTypeId: "RT_H002_TWIN", status: "AVAILABLE" },
    { roomId: "RM2301", hotelId: "H002", roomNumber: "301", roomTypeId: "RT_H002_SUITE", status: "AVAILABLE" },
    { roomId: "RM3101", hotelId: "H003", roomNumber: "101", roomTypeId: "RT_H003_TWIN", status: "AVAILABLE" },
    { roomId: "RM3201", hotelId: "H003", roomNumber: "201", roomTypeId: "RT_H003_FAMILY", status: "AVAILABLE" },
    { roomId: "RM3202", hotelId: "H003", roomNumber: "202", roomTypeId: "RT_H003_FAMILY", status: "AVAILABLE" },
    { roomId: "RM3301", hotelId: "H003", roomNumber: "301", roomTypeId: "RT_H003_DELUXE", status: "OUT_OF_SERVICE" },
    { roomId: "RM4101", hotelId: "H004", roomNumber: "101", roomTypeId: "RT_H004_TWIN", status: "AVAILABLE" },
    { roomId: "RM4201", hotelId: "H004", roomNumber: "201", roomTypeId: "RT_H004_DELUXE", status: "AVAILABLE" },
    { roomId: "RM5101", hotelId: "H005", roomNumber: "101", roomTypeId: "RT_H005_SINGLE", status: "AVAILABLE" },
    { roomId: "RM5102", hotelId: "H005", roomNumber: "102", roomTypeId: "RT_H005_SINGLE", status: "AVAILABLE" },
    { roomId: "RM5201", hotelId: "H005", roomNumber: "201", roomTypeId: "RT_H005_TWIN", status: "AVAILABLE" },
    ...buildExtraRooms(EXTRA_HOTELS)
  ],
  customers: [
    { customerId: "C001", name: "山田 太郎", email: "taro@example.com", phone: "090-0000-0000" },
    ...EXTRA_ACCOUNTS.map(({ customerId, name, email, phone }) => ({ customerId, name, email, phone }))
  ],
  reservations: [],
  stays: [],
  extraCharges: [],
  invoices: [],
  payments: [],
  lastSearch: null,
  resultSort: "priceAsc",
  signedInHotelId: ""
};

const ROOM_TYPE_NAMES = ["Single", "Twin", "Deluxe", "Suite", "Family"];
const OPERATOR_ACCOUNTS = [
  { userId: "admin", password: "admin123", role: "ADMIN", hotelId: "" },
  { userId: "admin001", password: "admin123", role: "ADMIN", hotelId: "" },
  { userId: "manager001", password: "admin123", role: "ADMIN", hotelId: "" },
  ...seedState.hotels.map((hotel) => ({
    userId: `${hotel.hotelId.toLowerCase()}-front`,
    password: `front-${hotel.hotelId.toLowerCase()}`,
    role: "STAFF",
    hotelId: hotel.hotelId
  }))
];
const RESERVATION_TRANSITIONS = {
  RESERVED: {
    cancel: "CANCELLED",
    checkIn: "CHECKED_IN"
  },
  CHECKED_IN: {
    checkOut: "CHECKED_OUT"
  },
  CANCELLED: {},
  CHECKED_OUT: {}
};
const RESERVATION_TRANSITION_ERRORS = {
  cancel: "この予約状態ではキャンセルできません。",
  checkIn: "RESERVEDの予約のみチェックインできます。",
  checkOut: "CHECKED_INの予約のみチェックアウトできます。"
};

let state = loadState();
const portal = document.body.dataset.portal || "customer";
normalizeSessionForPortal();
const app = document.querySelector("#app");
const rolePill = document.querySelector("#rolePill");
const loginButton = document.querySelector("#loginButton");
const logoutButton = document.querySelector("#logoutButton");

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => render(button.dataset.view));
});
loginButton?.addEventListener("click", () => render(loginViewForPortal()));
logoutButton.addEventListener("click", () => {
  state.role = "GUEST";
  state.signedInUserId = "";
  state.signedInHotelId = "";
  saveState();
  render(initialViewForPortal());
  toast("ログアウトしました。");
});

render(initialViewForPortal());

function searchAvailability(query) {
  validateDates(query.checkInDate, query.checkOutDate);
  const nights = nightsBetween(query.checkInDate, query.checkOutDate);
  return state.roomTypes
    .filter((type) => hotelMatchesLocation(type.hotelId, query))
    .filter((type) => !query.hotelId || type.hotelId === query.hotelId)
    .filter((type) => !query.roomTypeId || type.roomTypeId === query.roomTypeId)
    .filter((type) => !query.roomTypeName || type.name === query.roomTypeName)
    .filter((type) => type.capacity >= query.guestCount)
    .map((type) => {
      const availableRooms = availableRoomCount(type.hotelId, type.roomTypeId, query.checkInDate, query.checkOutDate);
      return {
        hotelId: type.hotelId,
        hotelName: hotelById(type.hotelId).name,
        roomTypeId: type.roomTypeId,
        roomTypeName: type.name,
        capacity: type.capacity,
        guestCount: query.guestCount,
        nights,
        availableRooms,
        estimatedAmount: type.pricePerNight * nights
      };
    })
    .filter((result) => result.availableRooms > 0);
}

function reserveRoom(customerInput) {
  const query = state.lastSearch;
  if (!query) {
    throw new Error("空室検索から予約を開始してください。");
  }
  const account = requireCustomerAccount();
  validateDates(query.checkInDate, query.checkOutDate);
  const availability = searchAvailability(query);
  if (!availability.some((item) => item.roomTypeId === query.roomTypeId)) {
    throw new Error("指定条件で予約できる空室がありません。");
  }
  const roomType = state.roomTypes.find((type) => type.roomTypeId === query.roomTypeId);
  const customer = syncCustomerFromAccount(account);
  const reservation = {
    reservationId: id("R"),
    customerId: customer.customerId,
    hotelId: query.hotelId,
    roomTypeId: query.roomTypeId,
    assignedRoomId: "",
    checkInDate: query.checkInDate,
    checkOutDate: query.checkOutDate,
    guestCount: query.guestCount,
    status: "RESERVED",
    baseAmount: roomType.pricePerNight * nightsBetween(query.checkInDate, query.checkOutDate),
    basePaid: false,
    reservedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    cancelledAt: "",
    checkedInAt: "",
    checkedOutAt: ""
  };
  state.reservations.push(reservation);
  return reservation;
}

function reservationDetails(reservationId) {
  const reservation = state.reservations.find((item) => item.reservationId === reservationId);
  if (!reservation) {
    throw new Error("予約番号が見つかりません。");
  }
  return {
    reservation,
    customer: state.customers.find((item) => item.customerId === reservation.customerId) || {},
    hotel: state.hotels.find((item) => item.hotelId === reservation.hotelId) || {},
    roomType: state.roomTypes.find((item) => item.roomTypeId === reservation.roomTypeId) || {},
    room: state.rooms.find((item) => item.roomId === reservation.assignedRoomId)
  };
}

function cancelReservation(reservationId) {
  const detail = reservationDetails(reservationId);
  assertReservationTransition(detail.reservation, "cancel");
  detail.reservation.cancelledAt = new Date().toISOString();
  transitionReservation(detail.reservation, "cancel");
}

function checkIn(reservationId) {
  const detail = reservationDetails(reservationId);
  assertStaffCanAccessReservation(detail.reservation);
  assertReservationTransition(detail.reservation, "checkIn");
  const room = state.rooms.find((candidate) =>
    candidate.hotelId === detail.reservation.hotelId &&
    candidate.roomTypeId === detail.reservation.roomTypeId &&
    candidate.status === "AVAILABLE");
  if (!room) {
    throw new Error("割り当て可能な部屋がありません。");
  }
  room.status = "OCCUPIED";
  detail.reservation.assignedRoomId = room.roomId;
  detail.reservation.checkedInAt = new Date().toISOString();
  transitionReservation(detail.reservation, "checkIn");
  state.stays.push({
    stayId: id("S"),
    reservationId,
    roomId: room.roomId,
    actualCheckInAt: new Date().toISOString(),
    actualCheckOutAt: ""
  });
  return reservationDetails(reservationId);
}

function checkOut(reservationKey, charges, method) {
  let reservation = state.reservations.find((item) => item.reservationId === reservationKey);
  if (!reservation) {
    const room = state.rooms.find((item) =>
      item.roomNumber === reservationKey &&
      (!currentStaffHotelId() || item.hotelId === currentStaffHotelId()));
    reservation = state.reservations.find((item) => item.assignedRoomId === room?.roomId && item.status === "CHECKED_IN");
  }
  if (!reservation) {
    throw new Error("予約番号または部屋番号が見つかりません。");
  }
  assertStaffCanAccessReservation(reservation);
  assertReservationTransition(reservation, "checkOut");
  const extraAmount = charges.reduce((sum, charge) => sum + charge.amount, 0);
  charges.forEach((charge) => state.extraCharges.push({
    chargeId: id("E"),
    reservationId: reservation.reservationId,
    name: charge.name,
    amount: charge.amount
  }));
  const invoice = {
    invoiceId: id("I"),
    reservationId: reservation.reservationId,
    baseAmount: reservation.baseAmount,
    extraAmount,
    totalAmount: reservation.baseAmount + extraAmount,
    issuedAt: new Date().toISOString()
  };
  state.invoices.push(invoice);
  state.payments.push({
    paymentId: id("P"),
    reservationId: reservation.reservationId,
    paymentType: "CHECKOUT_TOTAL",
    amount: invoice.totalAmount,
    method,
    paidAt: new Date().toISOString()
  });
  reservation.basePaid = true;
  const room = state.rooms.find((item) => item.roomId === reservation.assignedRoomId);
  if (room) {
    room.status = "AVAILABLE";
  }
  transitionReservation(reservation, "checkOut");
  reservation.checkedOutAt = new Date().toISOString();
  const stay = state.stays.find((item) => item.reservationId === reservation.reservationId && !item.actualCheckOutAt);
  if (stay) {
    stay.actualCheckOutAt = new Date().toISOString();
  }
  return invoice;
}

function reservationDetailsList(keyword) {
  const value = String(keyword || "").trim();
  if (!value) {
    throw new Error("予約番号、メールアドレス、電話番号のいずれかを入力してください。");
  }
  const normalizedReservationId = normalizeReservationInput(value);
  const normalizedKeyword = value.toLowerCase();
  const normalizedPhone = normalizeReservationInput(value);
  let reservations = state.reservations.filter((reservation) => reservation.reservationId === normalizedReservationId);
  if (!reservations.length) {
    const customerIds = new Set(state.customers
      .filter((customer) =>
        customer.email?.toLowerCase() === normalizedKeyword ||
        normalizeReservationInput(customer.phone) === normalizedPhone ||
        customer.name?.toLowerCase().includes(normalizedKeyword))
      .map((customer) => customer.customerId));
    reservations = state.reservations.filter((reservation) => customerIds.has(reservation.customerId));
  }
  if (!reservations.length) {
    throw new Error("条件に一致する予約が見つかりません。");
  }
  return scopedReservations(reservations)
    .slice()
    .sort((a, b) => new Date(b.createdAt || b.reservedAt || 0) - new Date(a.createdAt || a.reservedAt || 0))
    .map((reservation) => reservationDetails(reservation.reservationId));
}

function staffReservationDetailsList(keyword) {
  const details = reservationDetailsList(keyword);
  if (!details.length) {
    throw new Error("担当ホテルの予約が見つかりません。");
  }
  return details;
}

function staffReservations() {
  const hotelId = currentStaffHotelId();
  return state.reservations.filter((reservation) => !hotelId || reservation.hotelId === hotelId);
}

function reservationDetailsForSignedInUser() {
  const account = requireCustomerAccount();
  return state.reservations
    .filter((reservation) => reservation.customerId === account.customerId)
    .slice()
    .sort((a, b) => new Date(b.createdAt || b.reservedAt || 0) - new Date(a.createdAt || a.reservedAt || 0))
    .map((reservation) => reservationDetails(reservation.reservationId));
}

function validateDates(checkInDate, checkOutDate) {
  if (!checkInDate || !checkOutDate || new Date(checkOutDate) <= new Date(checkInDate)) {
    throw new Error("チェックアウト日はチェックイン日より後にしてください。");
  }
}

function datesOverlap(aStart, aEnd, bStart, bEnd) {
  return new Date(aStart) < new Date(bEnd) && new Date(aEnd) > new Date(bStart);
}

function nightsBetween(checkInDate, checkOutDate) {
  return Math.round((new Date(checkOutDate) - new Date(checkInDate)) / 86400000);
}

function defaultSearch() {
  const today = new Date();
  const checkIn = new Date(today.getTime() + 86400000);
  const checkOut = new Date(today.getTime() + 86400000 * 2);
  return {
    hotelId: "",
    region: "",
    prefecture: "",
    city: "",
    checkInDate: isoDate(checkIn),
    checkOutDate: isoDate(checkOut),
    guestCount: 1,
    roomTypeName: "",
    roomTypeId: ""
  };
}

function defaultHotel() {
  return state.hotels[0] || seedState.hotels[0];
}

function hotelById(hotelId) {
  return state.hotels.find((hotel) => hotel.hotelId === hotelId) || defaultHotel();
}

function hotelMatchesLocation(hotelId, query = {}) {
  const hotel = hotelById(hotelId);
  return (!query.region || hotel.region === query.region) &&
    (!query.prefecture || hotel.prefecture === query.prefecture) &&
    (!query.city || hotel.city === query.city);
}

function locationOptions(level, filters = {}) {
  const hotels = state.hotels.filter((hotel) =>
    (!filters.region || hotel.region === filters.region) &&
    (!filters.prefecture || hotel.prefecture === filters.prefecture));
  return [...new Set(hotels.map((hotel) => hotel[level]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ja"));
}

function roomTypeNameOptions() {
  return ROOM_TYPE_NAMES.filter((name) => state.roomTypes.some((type) => type.name === name));
}

function featuredRoomTypes() {
  const byName = new Map();
  state.roomTypes.forEach((type) => {
    const existing = byName.get(type.name);
    if (!existing || type.pricePerNight < existing.pricePerNight) {
      byName.set(type.name, type);
    }
  });
  return [...byName.values()];
}

function normalizeReservationInput(value) {
  return String(value || "").trim().toUpperCase();
}

function normalizeLoginId(value) {
  return String(value || "").trim().toLowerCase();
}

function authenticateOperator(userId, password, requiredRole) {
  const normalizedUserId = normalizeLoginId(userId);
  if (requiredRole === "STAFF") {
    const matched = normalizedUserId.match(/^h(\d{3})-front$/);
    const hotelId = matched ? `H${matched[1]}` : "";
    const hotelExists = state.hotels.some((hotel) => hotel.hotelId === hotelId);
    if (hotelExists && password === `front-h${matched[1]}`) {
      return { userId: normalizedUserId, password, role: "STAFF", hotelId };
    }
    return null;
  }
  const account = OPERATOR_ACCOUNTS.find((operator) =>
    operator.userId === normalizedUserId && operator.password === password && operator.role === requiredRole);
  return account || null;
}

function loginUserAccount(email, password) {
  const normalizedEmail = normalizeLoginId(email);
  return state.accounts.find((account) =>
    account.email.toLowerCase() === normalizedEmail && account.password === password);
}

function registerUserAccount(input) {
  const account = {
    accountId: id("U"),
    customerId: id("C"),
    name: String(input.name || "").trim(),
    email: normalizeLoginId(input.email),
    phone: String(input.phone || "").trim(),
    password: String(input.password || ""),
    createdAt: new Date().toISOString()
  };
  const passwordConfirm = String(input.passwordConfirm || "");
  if (!account.name || !account.email || !account.phone || !account.password) {
    throw new Error("氏名、メールアドレス、電話番号、パスワードを入力してください。");
  }
  if (!account.email.includes("@")) {
    throw new Error("メールアドレスの形式を確認してください。");
  }
  if (account.password.length < 4) {
    throw new Error("パスワードは4文字以上にしてください。");
  }
  if (account.password !== passwordConfirm) {
    throw new Error("確認用パスワードが一致しません。");
  }
  if (state.accounts.some((existing) => existing.email.toLowerCase() === account.email)) {
    throw new Error("このメールアドレスはすでに登録されています。");
  }
  state.accounts.push(account);
  syncCustomerFromAccount(account);
  return account;
}

function currentUserAccount() {
  if (state.role !== "USER" || !state.signedInUserId) {
    return null;
  }
  return state.accounts.find((account) => account.accountId === state.signedInUserId) || null;
}

function requireCustomerAccount() {
  const account = currentUserAccount();
  if (!account) {
    throw new Error("予約にはユーザログインが必要です。");
  }
  return account;
}

function syncCustomerFromAccount(account) {
  let customer = state.customers.find((item) => item.customerId === account.customerId);
  if (!customer) {
    customer = { customerId: account.customerId, name: "", email: "", phone: "" };
    state.customers.push(customer);
  }
  customer.name = account.name;
  customer.email = account.email;
  customer.phone = account.phone;
  return customer;
}

function signIn(role, signedInUserId, signedInHotelId = "") {
  state.role = role;
  state.signedInUserId = signedInUserId;
  state.signedInHotelId = signedInHotelId;
  saveState();
}

function normalizeSessionForPortal() {
  const allowedRoles = {
    customer: ["GUEST", "USER"],
    staff: ["STAFF"],
    admin: ["ADMIN"]
  }[portal] || ["GUEST"];
  if (!allowedRoles.includes(state.role) || (portal === "staff" && state.role === "STAFF" && !state.signedInHotelId)) {
    state.role = "GUEST";
    state.signedInUserId = "";
    state.signedInHotelId = "";
    saveState();
  }
}

function initialViewForPortal() {
  if (portal === "staff") {
    return state.role === "STAFF" ? "staff" : "staffLogin";
  }
  if (portal === "admin") {
    return state.role === "ADMIN" ? "admin" : "adminLogin";
  }
  return "home";
}

function loginViewForPortal() {
  if (portal === "staff") return "staffLogin";
  if (portal === "admin") return "adminLogin";
  return "account";
}

function assertReservationTransition(reservation, action) {
  if (!reservation) {
    throw new Error("予約番号が見つかりません。");
  }
  const nextStatus = RESERVATION_TRANSITIONS[reservation.status]?.[action];
  if (!nextStatus) {
    throw new Error(RESERVATION_TRANSITION_ERRORS[action] || "この予約状態では操作できません。");
  }
  return nextStatus;
}

function currentStaffHotelId() {
  return state.role === "STAFF" ? state.signedInHotelId : "";
}

function currentStaffHotel() {
  return currentStaffHotelId() ? hotelById(currentStaffHotelId()) : null;
}

function scopedReservations(reservations) {
  const hotelId = currentStaffHotelId();
  if (!hotelId) {
    return reservations;
  }
  return reservations.filter((reservation) => reservation.hotelId === hotelId);
}

function assertStaffCanAccessReservation(reservation) {
  const hotelId = currentStaffHotelId();
  if (hotelId && reservation.hotelId !== hotelId) {
    throw new Error("このスタッフアカウントでは担当ホテル以外の予約を扱えません。");
  }
}

function transitionReservation(reservation, action) {
  reservation.status = assertReservationTransition(reservation, action);
  return reservation;
}

function roomDescription(roomTypeName) {
  return {
    Single: "一人旅や出張に向いた静かな標準ルームです。",
    Twin: "友人や家族で使いやすい2名向けルームです。",
    Deluxe: "ゆとりある滞在向けの上位ルームです。"
  }[roomTypeName] || "予約可能な部屋タイプです。";
}

function totalRoomCount(hotelId, roomTypeId, targetState = state) {
  return targetState.rooms
    .filter((room) => room.hotelId === hotelId)
    .filter((room) => room.roomTypeId === roomTypeId)
    .filter((room) => room.status !== "OUT_OF_SERVICE").length;
}

function overlappingReservationCount(hotelId, roomTypeId, checkInDate, checkOutDate, targetState = state) {
  return targetState.reservations
    .filter((reservation) => ["RESERVED", "CHECKED_IN"].includes(reservation.status))
    .filter((reservation) => reservation.hotelId === hotelId && reservation.roomTypeId === roomTypeId)
    .filter((reservation) => datesOverlap(checkInDate, checkOutDate, reservation.checkInDate, reservation.checkOutDate)).length;
}

function availableRoomCount(hotelId, roomTypeId, checkInDate, checkOutDate, targetState = state) {
  validateDates(checkInDate, checkOutDate);
  const totalRooms = totalRoomCount(hotelId, roomTypeId, targetState);
  const overlappingReservations = overlappingReservationCount(hotelId, roomTypeId, checkInDate, checkOutDate, targetState);
  return Math.max(0, totalRooms - overlappingReservations);
}

function totalAvailableRooms(hotelId, checkInDate, checkOutDate) {
  const range = checkInDate && checkOutDate
    ? { checkInDate, checkOutDate }
    : defaultInventoryRange();
  return state.roomTypes
    .filter((type) => !hotelId || type.hotelId === hotelId)
    .reduce((sum, type) => sum + availableRoomCount(type.hotelId, type.roomTypeId, range.checkInDate, range.checkOutDate), 0);
}

function defaultInventoryRange() {
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86400000);
  return {
    checkInDate: isoDate(today),
    checkOutDate: isoDate(tomorrow)
  };
}

function nextHotelId() {
  return `H${String(state.hotels.length + 1).padStart(3, "0")}`;
}

function nextRoomTypeId(hotelId, offset = 1) {
  const suffix = state.roomTypes.filter((type) => type.hotelId === hotelId).length + offset;
  return `RT_${hotelId}_${suffix}`;
}

function nextRoomId(offset = 1) {
  return `RM${String(state.rooms.length + offset).padStart(3, "0")}`;
}

function id(prefix) {
  if (prefix === "R") {
    const today = new Date();
    const date = isoDate(today).replaceAll("-", "");
    const count = state.reservations.filter((reservation) => reservation.reservationId.includes(date)).length + 1;
    return `R-${date}-${String(count).padStart(3, "0")}`;
  }
  const random = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${random.toUpperCase()}`;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function saveState() {
  delete state.roomTypeInventories;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return normalizeState(structuredClone(seedState));
  }
  try {
    return normalizeState({ ...structuredClone(seedState), ...JSON.parse(saved) });
  } catch {
    return normalizeState(structuredClone(seedState));
  }
}

function normalizeState(rawState) {
  const normalized = { ...structuredClone(seedState), ...rawState };
  normalized.signedInHotelId = normalized.signedInHotelId || "";
  normalized.resultSort = normalized.resultSort || "priceAsc";
  normalized.accounts = mergeSeedItems(seedState.accounts, normalized.accounts || [], "accountId").map((account) => ({
    accountId: account.accountId || idFromSeed("U"),
    customerId: account.customerId || idFromSeed("C"),
    name: "",
    email: "",
    phone: "",
    password: "",
    createdAt: "",
    ...account,
    email: normalizeLoginId(account.email)
  }));
  normalized.customers = mergeSeedItems(seedState.customers, normalized.customers || [], "customerId");
  normalized.hotels = mergeSeedItems(seedState.hotels, normalized.hotels || [], "hotelId").map((hotel) => ({
    region: "",
    prefecture: "",
    city: "",
    address: "",
    description: "",
    ...hotel
  }));
  normalized.roomTypes = mergeSeedItems(seedState.roomTypes, normalized.roomTypes || [], "roomTypeId");
  normalized.rooms = mergeSeedItems(seedState.rooms, normalized.rooms || [], "roomId");
  delete normalized.roomTypeInventories;
  normalized.reservations = normalized.reservations.map((reservation) => ({
    reservedAt: reservation.createdAt || "",
    cancelledAt: "",
    checkedInAt: "",
    checkedOutAt: "",
    ...reservation,
    basePaid: Boolean(reservation.basePaid)
  }));
  normalized.accounts.forEach((account) => {
    let customer = normalized.customers.find((item) => item.customerId === account.customerId);
    if (!customer) {
      customer = { customerId: account.customerId, name: "", email: "", phone: "" };
      normalized.customers.push(customer);
    }
    customer.name = account.name;
    customer.email = account.email;
    customer.phone = account.phone;
  });
  return normalized;
}

function idFromSeed(prefix) {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${random.toUpperCase()}`;
}

function mergeSeedItems(seedItems, savedItems, key) {
  const savedById = new Map(savedItems.map((item) => [item[key], item]));
  const merged = seedItems.map((seedItem) => ({
    ...seedItem,
    ...(savedById.get(seedItem[key]) || {})
  }));
  const seedIds = new Set(seedItems.map((item) => item[key]));
  return merged.concat(savedItems.filter((item) => !seedIds.has(item[key])));
}
