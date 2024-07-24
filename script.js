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
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Gagal memuat data dari Firebase',
            });
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

function tampilkanAgenda() {
    const agendaBody = document.getElementById("agendaBody");
    agendaBody.innerHTML = "";

    agendaData.forEach((agenda, index) => {
        const row = document.createElement('tr');
        
        // Menentukan tipe agenda (ini hanya contoh, sesuaikan dengan logika aplikasi Anda)
        const agendaType = (index % 5) + 1; // Ini akan menghasilkan tipe 1-5 secara berurutan
        row.classList.add(`agenda-type-${agendaType}`);
        
        const petugasList = agenda.petugas.map((petugas, idx) => `<div>${idx + 1}. ${petugas}</div>`).join('');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${agenda.pemohon}</td>
            <td>${agenda.tanggal}</td>
            <td>${agenda.tempat}</td>
            <td>${agenda.uraian}</td>
            <td><div class="petugas-list">${petugasList}</div></td>
            <td>
                <button class="btn btn-sm btn-warning mb-1" onclick="editAgenda(${index})" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="hapusAgenda(${index})" title="Hapus"><i class="fas fa-trash"></i></button>
            </td>
        `;
        agendaBody.appendChild(row);
    });
}

function toggleForm() {
    const formWrapper = document.getElementById('agendaFormWrapper');
    const showFormBtn = document.getElementById('showFormBtn');
    if (formWrapper.style.display === 'none') {
        formWrapper.style.display = 'block';
        showFormBtn.style.display = 'none';
    } else {
        formWrapper.style.display = 'none';
        showFormBtn.style.display = 'block';
    }
}

function resetForm() {
    document.getElementById("agendaForm").reset();
    $('#petugas').selectpicker('deselectAll');
    document.getElementById("editIndex").value = "-1";
}

function tambahAgenda(event) {
    event.preventDefault();
    const editIndex = document.getElementById("editIndex").value;
    const agenda = {
        pemohon: document.getElementById("pemohon").value,
        tanggal: document.getElementById("tanggal").value,
        tempat: document.getElementById("tempat").value,
        uraian: document.getElementById("uraian").value,
        petugas: $('#petugas').val() || []
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
    
    $('#petugas').selectpicker('val', agenda.petugas);
    
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

function initTypeIt() {
    const instance = new TypeIt("#judul", { 
        lifeLike: false, 
        speed: 0,
        afterComplete: (instance) => {
            instance.destroy();
            initTypeIt(); // Memulai animasi lagi setelah selesai
        }
    })
	.delete(21, {instant: true})
	.pause(248)
	.type("A")
	.pause(184)
	.type("g")
	.pause(184)
	.type("e")
	.pause(120)
	.type("n")
	.pause(88)
	.type("d")
	.pause(56)
	.type("a")
	.pause(160)
	.type(" ")
	.pause(176)
	.type("K")
	.pause(576)
	.type("e")
	.pause(208)
	.type("g")
	.pause(136)
	.type("i")
	.pause(88)
	.type("a")
	.pause(120)
	.type("t")
	.pause(104)
	.type("a")
	.pause(104)
	.type("n")
	.pause(192)
	.type(" ")
	.pause(192)
	.type("B")
	.pause(192)
	.type("i")
	.pause(112)
	.type("d")
	.pause(64)
	.type("a")
	.pause(136)
	.type("n")
	.pause(88)
	.type("g")
	.pause(4832)
	.delete(1)
	.pause(500)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(35)
	.delete(1)
	.pause(31)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(520)
	.type("I")
	.pause(208)
	.type("n")
	.pause(88)
	.type("f")
	.pause(184)
	.type("r")
	.pause(160)
	.type("a")
	.pause(768)
	.type("s")
	.pause(272)
	.type("t")
    .pause(176)
	.type("r")
	.pause(120)
	.type("u")
	.pause(184)
	.type("k")
	.pause(129)
	.type("t")
	.pause(128)
	.type("u")
	.pause(120)
	.type("r")
	.pause(376)
	.type(" ")
	.pause(240)
	.type("T")
	.pause(120)
	.type("I")
	.pause(264)
	.type("K")
	.pause(3833)
	.delete(1)
	.pause(500)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(32)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(32)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(357)
	.type("D")
	.pause(304)
	.type("i")
	.pause(168)
	.type("s")
	.pause(136)
	.type("k")
	.pause(136)
	.type("o")
	.pause(168)
	.type("m")
	.pause(192)
	.type("i")
	.pause(104)
	.type("n")
	.pause(144)
	.type("f")
	.pause(97)
	.type("o")
	.pause(248)
	.type(" ")
	.pause(216)
	.type("K")
	.pause(216)
	.type("u")
	.pause(264)
	.type("n")
	.pause(80)
	.type("i")
	.pause(112)
	.type("n")
	.pause(96)
	.type("g")
	.pause(72)
	.type("a")
	.pause(152)
	.type("n")
	.pause(4513)
	.delete(1)
	.pause(500)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(32)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.pause(33)
	.delete(1)
	.go();
}

function setupAutoRefresh() {
    const twelveHoursInMilliseconds = 12 * 60 * 60 * 1000;
    setTimeout(() => {
        location.reload();
    }, twelveHoursInMilliseconds);
}

document.addEventListener('DOMContentLoaded', () => {
    initTypeIt();
    bacaDariFirebase();

    // Initialize Bootstrap-select
    $('.selectpicker').selectpicker({
        actionsBox: true,
        selectAllText: 'Pilih Semua',
        deselectAllText: 'Hapus Semua',
        noneSelectedText: 'Tidak ada yang dipilih'
    });

    // Add event listeners for the new buttons
    document.getElementById('showFormBtn').addEventListener('click', toggleForm);
    document.getElementById('cancelBtn').addEventListener('click', () => {
        resetForm();
        toggleForm();
    });
    
    // Attach the form submission event
    document.getElementById('agendaForm').addEventListener('submit', tambahAgenda);
});