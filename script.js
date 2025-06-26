// Ticket ID generator
function generateID() {
  return 'TIKET-' + Date.now();
}

// Save to LocalStorage
function saveTicket(data) {
  let tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
  tickets.push(data);
  localStorage.setItem('tickets', JSON.stringify(tickets));
}

// Form submission: Pemesanan Tiket
const form = document.getElementById('ticketForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const id = generateID();
    const data = {
      id,
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      checkedIn: false,
    };
    saveTicket(data);
    document.getElementById('ticketInfo').innerHTML = `Tiket Anda berhasil dipesan! ID Tiket: <strong>${id}</strong>`;
    form.reset();
  });
}

// Login Admin
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    if (user === 'admin' && pass === 'admin123') {
      window.location.href = 'admin.html';
    } else if (user === 'checkin' && pass === 'checkin123') {
      window.location.href = 'checkin.html';
    } else if (user === 'laporan' && pass === 'laporan123') {
      window.location.href = 'laporan.html';
    } else {
      document.getElementById('loginMsg').textContent = 'Login gagal.';
    }
  });
}

// Tampilkan pemesan di Admin
const table = document.getElementById('pemesanTable');
if (table) {
  const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
  table.innerHTML =
    `<tr><th>ID</th><th>Nama</th><th>Email</th><th>HP</th><th>Check-in</th><th>Aksi</th></tr>` +
    tickets
      .map(
        (t, i) => `
        <tr>
          <td>${t.id}</td>
          <td contenteditable onblur="updateField(${i}, 'name', this.textContent)">${t.name}</td>
          <td contenteditable onblur="updateField(${i}, 'email', this.textContent)">${t.email}</td>
          <td contenteditable onblur="updateField(${i}, 'phone', this.textContent)">${t.phone}</td>
          <td>${t.checkedIn ? '✔️' : '❌'}</td>
          <td><button onclick="deleteTicket(${i})">Hapus</button></td>
        </tr>`
      )
      .join('');
}

function updateField(index, key, value) {
  let tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
  tickets[index][key] = value;
  localStorage.setItem('tickets', JSON.stringify(tickets));
}

function deleteTicket(index) {
  let tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
  tickets.splice(index, 1);
  localStorage.setItem('tickets', JSON.stringify(tickets));
  location.reload();
}

// Check-in
const checkinForm = document.getElementById('checkinForm');
if (checkinForm) {
  checkinForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const id = document.getElementById('checkinID').value;
    let tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) {
      document.getElementById('checkinResult').textContent = 'ID Tiket tidak ditemukan.';
    } else if (ticket.checkedIn) {
      document.getElementById('checkinResult').textContent = 'Tiket sudah digunakan.';
    } else {
      ticket.checkedIn = true;
      localStorage.setItem('tickets', JSON.stringify(tickets));
      document.getElementById('checkinResult').innerHTML = `Check-in berhasil! <br>Nama: ${ticket.name}`;
    }
  });
}

// Laporan
const sudah = document.getElementById('sudahCheckin');
const belum = document.getElementById('belumCheckin');
if (sudah && belum) {
  let tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
  sudah.innerHTML = tickets
    .filter((t) => t.checkedIn)
    .map((t) => `<li>${t.name} (${t.id})</li>`)
    .join('');
  belum.innerHTML = tickets
    .filter((t) => !t.checkedIn)
    .map((t) => `<li>${t.name} (${t.id})</li>`)
    .join('');
}
