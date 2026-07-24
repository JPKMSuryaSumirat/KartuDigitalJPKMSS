let pesertaList = [];

function normalizeText(text) {
    return (text || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}

window.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("identity-form");
    const nameInput = document.getElementById("name");
    const packageInput = document.getElementById("package");

    const loadingElement = document.getElementById("loading");
    const resultElement = document.getElementById("result");
    const notFoundElement = document.getElementById("not-found");

    const kartuContainer = document.getElementById("kartu-container");
    const kartuGambar = document.getElementById("kartu-gambar");

    const autocompleteList = document.getElementById("autocomplete-list");

    loadingElement.style.display = "block";

    fetch("data.json")
        .then(res => res.json())
        .then(data => {

            pesertaList = data.peserta || [];

            loadingElement.style.display = "none";

        })
        .catch(err => {

            console.error(err);

            loadingElement.style.display = "none";

            alert("Gagal memuat data.");

        });

    // =============================
    // AUTOCOMPLETE
    // =============================

    nameInput.addEventListener("input", function () {

        autocompleteList.innerHTML = "";

        const keyword = this.value.toLowerCase();

        if (!keyword) return;

        const hasil = pesertaList
            .filter(item =>
                item["Nama Member"] &&
                item["Nama Member"].toLowerCase().includes(keyword)
            )
            .slice(0, 10);

        hasil.forEach(item => {

            const li = document.createElement("li");

            li.textContent = item["Nama Member"];

            li.onclick = function () {

                nameInput.value = item["Nama Member"];

                autocompleteList.innerHTML = "";

            };

            autocompleteList.appendChild(li);

        });

    });

    document.addEventListener("click", function (e) {

        if (e.target !== nameInput) {

            autocompleteList.innerHTML = "";

        }

    });

    // =============================
    // FORM CARI
    // =============================

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        resultElement.style.display = "none";
        notFoundElement.style.display = "none";

        const namaCari = normalizeText(nameInput.value);
        const paketCari = normalizeText(packageInput.value);

        const peserta = pesertaList.find(item => {

            const nama = normalizeText(item["Nama Member"]);
            const paket = normalizeText(item["Paket"]);

            const matchNama = nama === namaCari;

            if (paketCari === "siswa" || paketCari === "siswa santo aloysius") {
                return matchNama && paket.includes("siswa");
            }

            if (paketCari === "paket mahasiswa") {
                return matchNama && paket.includes("mahasiswa");
            }

            if (paketCari === "umum") {
                return matchNama &&
                    !paket.includes("siswa") &&
                    !paket.includes("mahasiswa");
            }

            return false;

        });

        if (!peserta) {

            notFoundElement.style.display = "block";

            return;

        }

        let cssClass = "";
        let gambar = "";

        switch ((peserta["Paket"] || "").toUpperCase()) {

            case "SISWA SANTO ALOYSIUS":
                cssClass = "kartu-aloysius";
                gambar = "Kartu Peserta Siswa Aloysius Kosong Untuk Web Kartu DepanBelakang.jpg";
                break;

            case "SISWA":
            case "MAHASISWA":
                cssClass = "kartu-siswa";
                gambar = "Kartu Peserta Siswa Kosong Untuk Web Kartu DepanBelakang.jpg";
                break;

            case "DASAR PLUS":
                cssClass = "kartu-dasarplus";
                gambar = "Kartu Peserta Dasar Plus Kosong Untuk Web Kartu DepanBelakang.jpg";
                break;

            case "PRIMER":
                cssClass = "kartu-primer";
                gambar = "Kartu Peserta Primer Kosong Untuk Web Kartu DepanBelakang.jpg";
                break;

            case "MIX":
                cssClass = "kartu-mix";
                gambar = "Kartu Peserta Mix Kosong Untuk Web Kartu DepanBelakang.jpg";
                break;

            case "ADVANCED":
                cssClass = "kartu-advanced";
                gambar = "Kartu Peserta Advanced Kosong Untuk Web Kartu DepanBelakang.jpg";
                break;

            case "EXECUTIVE":
                cssClass = "kartu-executive";
                gambar = "Kartu Peserta Executive Kosong Untuk Web Kartu DepanBelakang.jpg";
                break;

            case "PLATINUM":
                cssClass = "kartu-platinum";
                gambar = "Kartu Peserta Platinum Kosong Untuk Web Kartu DepanBelakang.jpg";
                break;

            case "KEUSKUPAN":
                cssClass = "kartu-keuskupan";
                gambar = "Kartu Peserta Keuskupan Kosong Untuk Web Kartu DepanBelakang.jpg";
                break;

            default:
                cssClass = "kartu-siswa";
                gambar = "Kartu Peserta Siswa Kosong Untuk Web Kartu DepanBelakang.jpg";

        }

        kartuContainer.className = `kartu-container ${cssClass}`;
        kartuGambar.src = gambar;

        document.getElementById("field-nama").textContent = peserta["Nama Member"];
        document.getElementById("field-nojpkm").textContent = peserta["No JPKM"];
        document.getElementById("field-namagrup").textContent = peserta["Grup"];
        document.getElementById("field-ppkbasis").textContent = peserta["PPK Basis"];
        document.getElementById("field-tgllahir").textContent = peserta["Tanggal Lahir"];
        document.getElementById("field-klinik").textContent = peserta["Klinik Layanan"];
        document.getElementById("field-plafon").textContent = peserta["Kode Plafond"];
        document.getElementById("field-gigi").textContent = peserta["Paket Tambahan"];
        document.getElementById("field-masaberlaku").textContent =
            `${peserta["Tanggal Masuk"]} s.d ${peserta["Tanggal Akhir Kontrak"]}`;

        const namaPaket = document.getElementById("field-namapaket");

        if (
            peserta["Paket"].toUpperCase().includes("SISWA") ||
            peserta["Paket"].toUpperCase().includes("MAHASISWA")
        ) {

            namaPaket.textContent = peserta["Paket"];
            namaPaket.style.display = "block";

        } else {

            namaPaket.style.display = "none";

        }

        resultElement.style.display = "block";

    });

});
