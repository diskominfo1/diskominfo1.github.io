const firebaseConfig = {
    apiKey: "AIzaSyBemV1XBWJAmnyRh3CLjrbps5IkN2ZSjA0",
    authDomain: "agenda-8456a.firebaseapp.com",
    projectId: "agenda-8456a",
    storageBucket: "agenda-8456a.appspot.com",
    messagingSenderId: "449399449573",
    appId: "1:449399449573:web:b5cec72e68a095eaa9b10c",
    measurementId: "G-SHEYBHFCM6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let agendaData = [];

function bacaDariFirebase() {
    database.ref('agendaData').once('value')
        .then(snapshot => {
            agendaData = snapshot.val() || [];
            tampilkanAgenda();
        })
        .catch(error => {
            console.error('Error saat membaca data dari Firebase:', error);
            
            let errorMessage = 'Terjadi kesalahan saat memuat data.';
            
            if (error.code === 'PERMISSION_DENIED') {
                errorMessage += ' Anda tidak memiliki izin untuk mengakses data ini.';
            } else if (error.code === 'NETWORK_ERROR') {
                errorMessage += ' Periksa koneksi internet Anda.';
            } else if (error.message) {
                errorMessage += ' Detail: ' + error.message;
            }

            Swal.fire({
                icon: 'error',
                title: 'Gagal Memuat Data',
                text: errorMessage,
                footer: '<a href="#">Butuh bantuan?</a>'
            });

            const agendaBody = document.getElementById("agendaBody");
            agendaBody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-5 py-5 border-b border-gray-200 text-sm text-center text-red-500">
                        ${errorMessage}<br>
                        Silakan coba muat ulang halaman atau hubungi administrator.
                    </td>
                </tr>
            `;
        });
}

function simpanKeFirebase() {
    database.ref('agendaData').set(agendaData)
        .then(() => {
            console.log('Data berhasil disimpan ke Firebase');
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Gagal menyimpan data ke Firebase',
            });
        });
}

function formatDate(dateString) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const date = new Date(dateString);
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName}, ${day} ${monthName} ${year}`;
}

function getDateClass(dateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'date-today';
    if (diffDays === 1) return 'date-tomorrow';
    if (diffDays === 2) return 'date-day-after-tomorrow';
    if (diffDays === -1) return 'date-yesterday';
    if (diffDays === -2) return 'date-day-before-yesterday';
    return '';
}

function tampilkanAgenda() {
    const agendaBody = document.getElementById("agendaBody");
    agendaBody.innerHTML = "";

    if (!Array.isArray(agendaData)) {
        console.error('agendaData bukan array:', agendaData);
        agendaBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-5 py-5 border-b border-gray-200 text-sm text-center text-red-500">
                    Terjadi kesalahan saat memuat data. Struktur data tidak sesuai.
                </td>
            </tr>
        `;
        return;
    }

    if (agendaData.length === 0) {
        agendaBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-5 py-5 border-b border-gray-200 text-sm text-center">
                    Tidak ada data agenda.
                </td>
            </tr>
        `;
        return;
    }

    agendaData.forEach((agenda, index) => {
        const row = document.createElement('tr');
        
        row.classList.add(index % 2 === 0 ? 'bg-gray-50' : 'bg-white');
        
        let petugasList = 'Tidak ada petugas';
        if (Array.isArray(agenda.petugas)) {
            petugasList = agenda.petugas.map((petugas, idx) => `<div>${idx + 1}. ${petugas}</div>`).join('');
        } else if (typeof agenda.petugas === 'string') {
            petugasList = agenda.petugas;
        }
        
        const dateClass = getDateClass(agenda.tanggal);
        const formattedDate = formatDate(agenda.tanggal);
        
        row.innerHTML = `
            <td class="py-3 px-6 text-left">${index + 1}</td>
            <td class="py-3 px-6 text-left wrap-text">${agenda.pemohon || ''}</td>
            <td class="py-3 px-6 text-center"><span class="date-highlight ${dateClass}">${formattedDate}</span></td>
            <td class="py-3 px-6 text-left wrap-text">${agenda.tempat || ''}</td>
            <td class="py-3 px-6 text-left wrap-text">${agenda.uraian || ''}</td>
            <td class="py-3 px-6 text-left wrap-text">${petugasList}</td>
            <td class="py-3 px-6 text-center">
                <button class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2" onclick="editAgenda(${index})" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" onclick="hapusAgenda(${index})" title="Hapus"><i class="fas fa-trash"></i></button>
            </td>
        `;
        agendaBody.appendChild(row);
    });
}

function toggleForm() {
    const formWrapper = document.getElementById('agendaFormWrapper');
    const showFormBtn = document.getElementById('showFormBtn');
    const overlay = document.getElementById('overlay');
    formWrapper.classList.toggle('hidden');
    showFormBtn.classList.toggle('hidden');
    overlay.classList.toggle('hidden');
    
    if (!formWrapper.classList.contains('hidden')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function resetForm() {
    document.getElementById("agendaForm").reset();
    document.getElementById("petugas").selectedIndex = -1;
    document.getElementById("editIndex").value = "-1";
}

function tambahAgenda(event) {
    event.preventDefault();
    const editIndex = document.getElementById("editIndex").value;
    const inputDate = document.getElementById("tanggal").value;
    const parsedDate = new Date(inputDate);
    
    const agenda = {
        pemohon: document.getElementById("pemohon").value,
        tanggal: parsedDate.toISOString().split('T')[0], // Store as YYYY-MM-DD
        tempat: document.getElementById("tempat").value,
        uraian: document.getElementById("uraian").value,
        petugas: Array.from(document.getElementById("petugas").selectedOptions).map(option => option.value)
    };

    if (editIndex === "-1") {
        agendaData.push(agenda);
        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Agenda baru telah ditambahkan!',
            showConfirmButton: false,
            timer: 1500
        });
    } else {
        agendaData[editIndex] = agenda;
        document.getElementById("editIndex").value = "-1";
        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Agenda telah diperbarui!',
            showConfirmButton: false,
            timer: 1500
        });
    }

    simpanKeFirebase();
    tampilkanAgenda();
    resetForm();
    toggleForm();
}

function editAgenda(index) {
    const agenda = agendaData[index];
    document.getElementById("pemohon").value = agenda.pemohon;
    document.getElementById("tanggal").value = agenda.tanggal;
    document.getElementById("tempat").value = agenda.tempat;
    document.getElementById("uraian").value = agenda.uraian;
    
    const petugasSelect = document.getElementById("petugas");
    Array.from(petugasSelect.options).forEach(option => {
        option.selected = agenda.petugas.includes(option.value);
    });
    
    document.getElementById("editIndex").value = index;

    toggleForm();

    Swal.fire({
        icon: 'info',
        title: 'Mode Edit',
        text: 'Anda sekarang dalam mode edit. Ubah data dan klik Simpan untuk menyimpan perubahan.',
        showConfirmButton: false,
        timer: 2000
    });
}

function hapusAgenda(index) {
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Anda tidak dapat mengembalikan ini!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            agendaData.splice(index, 1);
            simpanKeFirebase();
            tampilkanAgenda();
            Swal.fire(
                'Terhapus!',
                'Agenda telah dihapus.',
                'success'
            )
        }
    })
}

function setupAutoRefresh() {
    const twelveHoursInMilliseconds = 12 * 60 * 60 * 1000;
    setTimeout(() => {
        location.reload();
    }, twelveHoursInMilliseconds);
}

function initTypeIt() {
    new TypeIt("#title", {
        strings: "Agenda Kegiatan Bidang Infrastruktur TIK",
        speed: 50,
        waitUntilVisible: true
    }).go();
}

document.addEventListener('DOMContentLoaded', () => {
    initTypeIt();
    bacaDariFirebase();

    document.getElementById('showFormBtn').addEventListener('click', toggleForm);
    document.getElementById('cancelBtn').addEventListener('click', () => {
        resetForm();
        toggleForm();
    });
    
    document.getElementById('agendaForm').addEventListener('submit', tambahAgenda);

    const overlay = document.getElementById('overlay');
    overlay.addEventListener('click', toggleForm);

    setupAutoRefresh();
});
