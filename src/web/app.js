const STORAGE_KEY = "hrs-web-state-v2";

const seedState = {
  role: "GUEST",
  signedInUserId: "",
  hotels: [
    { hotelId: "H001", name: "Waseda Hotel", address: "1-6-1 Nishi-Waseda, Shinjuku-ku, Tokyo", description: "A quiet city hotel near the campus area." },
    { hotelId: "H002", name: "Shinjuku Garden Hotel", address: "3-38-1 Shinjuku, Shinjuku-ku, Tokyo", description: "A business hotel with easy station access." },
    { hotelId: "H003", name: "Bay View Hotel", address: "1-1-10 Aomi, Koto-ku, Tokyo", description: "A relaxed waterfront hotel for family stays." }
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
    { roomTypeId: "RT_H003_DELUXE", hotelId: "H003", name: "Deluxe", capacity: 3, pricePerNight: 26000 }
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
    { roomId: "RM3301", hotelId: "H003", roomNumber: "301", roomTypeId: "RT_H003_DELUXE", status: "OUT_OF_SERVICE" }
  ],
  customers: [],
  reservations: [],
  stays: [],
  extraCharges: [],
  invoices: [],
  payments: [],
  lastSearch: null
};

const ROOM_TYPE_NAMES = ["Single", "Twin", "Deluxe", "Suite", "Family"];
const AUTH_CONFIG = {
  staff: {
    ids: ["staff", "front001", "front002", "front003"],
    password: "staff123",
    role: "STAFF"
  },
  admin: {
    ids: ["admin", "admin001", "manager001"],
    password: "admin123",
    role: "ADMIN"
  }
};
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
const app = document.querySelector("#app");
const rolePill = document.querySelector("#rolePill");
const loginButton = document.querySelector("#loginButton");
const logoutButton = document.querySelector("#logoutButton");
const loginDialog = document.querySelector("#loginDialog");

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => render(button.dataset.view));
});
loginButton.addEventListener("click", () => loginDialog.showModal());
logoutButton.addEventListener("click", () => {
  state.role = "GUEST";
  state.signedInUserId = "";
  saveState();
  render("home");
  toast("顧客画面に戻りました。");
});
document.querySelector("#loginCancel").addEventListener("click", () => loginDialog.close());
document.querySelector("#loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const user = document.querySelector("#loginUser").value.trim();
  const password = document.querySelector("#loginPassword").value;
  const role = authenticate(user, password);
  if (role) {
    state.role = role;
    state.signedInUserId = normalizeLoginId(user);
    loginDialog.close();
    saveState();
    render(role === "STAFF" ? "staff" : "admin");
    toast(role === "STAFF" ? "スタッフとしてログインしました。" : "管理者としてログインしました。");
    return;
  }
  toast("ログイン情報が違います。");
});

render("home");

function searchAvailability(query) {
  validateDates(query.checkInDate, query.checkOutDate);
  const nights = nightsBetween(query.checkInDate, query.checkOutDate);
  return state.roomTypes
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
  validateDates(query.checkInDate, query.checkOutDate);
  const availability = searchAvailability(query);
  if (!availability.some((item) => item.roomTypeId === query.roomTypeId)) {
    throw new Error("指定条件で予約できる空室がありません。");
  }
  const roomType = state.roomTypes.find((type) => type.roomTypeId === query.roomTypeId);
  const customer = {
    customerId: id("C"),
    name: customerInput.name.trim(),
    email: customerInput.email.trim(),
    phone: customerInput.phone.trim()
  };
  if (!customer.name || !customer.email || !customer.phone) {
    throw new Error("氏名、メールアドレス、電話番号を入力してください。");
  }
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
  state.customers.push(customer);
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
    const room = state.rooms.find((item) => item.roomNumber === reservationKey);
    reservation = state.reservations.find((item) => item.assignedRoomId === room?.roomId && item.status === "CHECKED_IN");
  }
  if (!reservation) {
    throw new Error("予約番号または部屋番号が見つかりません。");
  }
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
  return reservations
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

function authenticate(userId, password) {
  const normalizedUserId = normalizeLoginId(userId);
  const accountGroup = Object.values(AUTH_CONFIG).find((group) =>
    group.ids.includes(normalizedUserId) && group.password === password);
  return accountGroup?.role || "";
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
  normalized.hotels = normalized.hotels.map((hotel) => ({
    address: "",
    description: "",
    ...hotel
  }));
  delete normalized.roomTypeInventories;
  normalized.reservations = normalized.reservations.map((reservation) => ({
    reservedAt: reservation.createdAt || "",
    cancelledAt: "",
    checkedInAt: "",
    checkedOutAt: "",
    ...reservation,
    basePaid: Boolean(reservation.basePaid)
  }));
  return normalized;
}
