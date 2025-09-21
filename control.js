/**
 * =======================================================================
 * APLIKASI PETA INTERAKTIF PERUBAHAN GARIS PANTAI DAN KERENTANAN PESISIR
 * =======================================================================
 * let = untuk mendeklarasikan variabel yang nilainya bisa diubah (reassignable).
   Variabel dapat diberikan nilai baru kapan pun setelah deklarasi awal.
   Contoh: let angka = 10;
   angka = 20; // Ini diperbolehkan.
 * const = untuk mendeklarasikan variabel yang nilainya tidak dapat diubah (immutable) setelah dideklarasikan. 
   Jika variabel diberi nilai baru/mencoba mengubah nilai yang telah dideklarasikan di awal, maka JavaScript akan melempar error.
   Contoh: const nama = 'Budi';
   nama = 'Andi'; // Ini akan menghasilkan error.
 */
document.addEventListener("DOMContentLoaded", () => {
  // A. VARIABEL PENGHUBUNG DENGAN ELEMEN/ITEM DI HTML MELALUI ID ////
  const menuToggleArea = document.getElementById("menu-toggle-area");
  const menuToggleIcon = document.getElementById("menu-toggle");
  const sideMenu = document.getElementById("sidemenu");
  const mainContent = document.getElementById("main-content");
  const menuItems = document.querySelectorAll(".sidemenu-item");
  const menuDivs = document.querySelectorAll(".menu-div");
  const closeButtons = document.querySelectorAll(".close-button");
  const geolocationBtn = document.getElementById("geolocation-btn");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const transparencySlider = document.getElementById("transparency-slider");
  const infoIcons = document.querySelectorAll(".fa-circle-info");
  const tableIcons = document.querySelectorAll(".table-icon");
  const tableContent = document.getElementById("table-content");
  const legendaContainer = document.getElementById("legenda-container");
  const noLegendText = document.getElementById("no-legend-text");
  const filterInitialText = document.getElementById("filter-initial-text");
  const kecamatanFilterGroup = document.getElementById(
    "kecamatan-filter-group"
  );
  const kecamatanFilter = document.getElementById("kecamatan-filter");
  const desaFilterGroup = document.getElementById("desa-filter-group");
  const desaFilter = document.getElementById("desa-filter");
  const skorFilterGroup = document.getElementById("skor-filter-group");
  const skorFilter = document.getElementById("skor-filter");
  const cviFilterGroup = document.getElementById("cvi-filter-group");
  const cviFilter = document.getElementById("cvi-filter");
  const layerCheckboxes = document.querySelectorAll('input[name="overlay"]');
  const resetButton = document.getElementById("reset-filter-btn");
  const informasiText = document.getElementById("informasi-text");

  // B. VARIABEL PENGHUBUNG UNTUK TAB VISUALISASI GAMBAR, GRAFIK, DSB
  const visualisasiTabContainer = document.getElementById(
    "visualisasi-tab-container"
  );
  const visualisasiTabHeader = document.getElementById(
    "visualisasi-tab-header"
  );
  const visualisasiTabTitle = document.getElementById("visualisasi-tab-title");
  const visualisasiTabContent = document.getElementById(
    "visualisasi-tab-content"
  );
  const visualisasiTabCloseBtn = document.querySelector(
    ".visualisasi-tab-close-btn"
  );
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  // ===================================================================
  // 1. PETA DAN CONTROL PETA
  // ===================================================================
  // A. Menampilkan Peta pada DIV 'map'
  var defaultLat = -8.757785434451973;
  var defaultLng = 115.17332621162974;
  var defaultZoom = 12;
  var map = L.map("map").setView([defaultLat, defaultLng], defaultZoom);

  // B. Skala Peta
  L.control.scale({ imperial: false, position: "topright" }).addTo(map);

  // C. Mendeklrasaikan pilihan Basemap
  var esriGrayCanvas = L.tileLayer.provider("Esri.WorldGrayCanvas");
  var osmLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });
  var esriSatelitLayer = L.tileLayer.provider("Esri.WorldImagery");

  // D. Default Basemap saat website pertama kali diakses
  esriGrayCanvas.addTo(map);

  // E. Adjust map size when layout changes
  const resizeObserver = new ResizeObserver(() => {
    map.invalidateSize();
  });
  resizeObserver.observe(mainContent);

  // Dapatkan elemen tombol dan tambahkan event listener
  var resetZoom = document.getElementById("reset-view-btn");

  resetZoom.addEventListener("click", function () {
    // Mengembalikan peta ke posisi dan zoom default
    map.setView([defaultLat, defaultLng], defaultZoom);
  });

  // ===================================================================
  // 2. VARIABEL GLOBAL & STATE APLIKASI
  // ===================================================================
  // A. Variabel untuk pengaturan Basemap
  let currentBasemap = esriGrayCanvas;
  const basemapControls = document.getElementById("basemap-controls");

  // B. Variabel untuk pengaturan dan penyimpanan layers dan data GeoJSON
  let slrlnLayer = null;
  let waveLayer = null;
  let glglnLayer = null;
  let slplnLayer = null;
  let pslnLayer = null;
  let sclnLayer = null;
  let gmrflnLayer = null;
  let intrsctLayer = null;
  let bslnLayer = null;
  let scteprLayer = null;
  let sctnsmLayer = null;
  let sctlrrLayer = null;
  let scarLayer = null;
  let cvilnLayer = null;
  let ardesaLayer = null;
  let garisPantai2016Layer = null;
  let garisPantai2017Layer = null;
  let garisPantai2018Layer = null;
  let garisPantai2019Layer = null;
  let garisPantai2020Layer = null;
  let garisPantai2021Layer = null;
  let garisPantai2022Layer = null;
  let garisPantai2023Layer = null;
  let garisPantai2024Layer = null;

  const geojsonLayers = {
    slrln: null,
    waveln: null,
    glgln: null,
    slpln: null,
    psln: null,
    scln: null,
    gmrfln: null,
    intrsct: null,
    bsln: null,
    sctnsm: null,
    sctepr: null,
    sctlrr: null,
    scar: null,
    cviln: null,
    ardesa: null,
    "garis-pantai-2016": null,
    "garis-pantai-2017": null,
    "garis-pantai-2018": null,
    "garis-pantai-2019": null,
    "garis-pantai-2020": null,
    "garis-pantai-2021": null,
    "garis-pantai-2022": null,
    "garis-pantai-2023": null,
    "garis-pantai-2024": null,
  };
  const geojsonData = {};

  // C. Variabel untuk mengatur Visualisasi Data
  let visualisasiItems = [];
  let currentVisualisasiIndex = 0;
  // C.1. untuk melacak topmost overlay layer and an array of active layers
  let currentTopLayer = null;
  // Variabel baru untuk melacak layer tabel yang sedang dibuka
  let currentTableLayerName = null;

  // D. Variabel untuk menyimpan layer yang aktif saat Checkbox dicentang >>> Berhubungan dengan Filter
  let activeLayers = []; // D.1. untuk filter kecamatan dan desa (all data)
  let activeLayersWithSkor = []; // D.2. untuk filter skor (data kerentanan)
  let activeLayersWithCVI = []; // D.3. untuk filter cvi (data kerentanan all)

  // E. Variabel untuk pengaturan highlight layer dan tabel data
  // E.1. Menyimpan layer feature yang disorot di peta
  let selectionState = {
    layer: null, // Akan menyimpan objek feature Leaflet (polygon/titik)
    layerName: null, // Akan menyimpan nama layer induknya (misal: 'cviln')
  };
  // E.2. Menyimpan baris <tr> yang disorot di tabel
  let lastSelectedTableRow = null; // Sebelumnya lastHighlightedTableRow

  // E. Variabel yang menyimpan pengaturan Style untuk feature yang disorot di peta
  const highlightStyle = {
    weight: 4,
    color: "#00FFFF", // Cyan terang agar menonjol
    fillColor: "#00FFFF",
    fillOpacity: 0.7,
  };

  // F. Variabel untuk pengaturan Dropdown Chechbox Layers Data yang tersimpan
  const overlayControlGroups = document.querySelectorAll(".checkbox-group");

  // G. Variabel untuk pengaturan Geolocation
  let locationMarker = null;
  let accuracyCircle = null;

  // H. Dapatkan elemen HTML untuk menampilkan koordinat
  var coordDisplay = document.getElementById("coordinate-display");
  var isCoordLocked = false; // Status untuk menahan koordinat
  var isListening = false; // Status baru untuk mengaktifkan/menonaktifkan event
  var currentMarker = null; // Menyimpan referensi marker yang sedang aktif

  // I. Reset Zoom Layer

  // ===================================================================
  // 3. EVENT LISTENER UNTUK MENU DAN ITEM SIDE MENU KETIKA DI KLIK
  // ===================================================================
  // A. Area Menu
  menuToggleArea.addEventListener("click", () => {
    // Mengecek apakah menu samping saat ini sedang ditampilkan (memiliki class 'show-sidemenu').
    const isSideMenuVisible = sideMenu.classList.contains("show-sidemenu");

    if (isSideMenuVisible) {
      // JIKA MENU SEDANG TAMPIL, maka:
      sideMenu.classList.remove("show-sidemenu"); // akan disembunyikan menu navigasi
      mainContent.classList.remove("pushed-by-sidemenu"); // akan menggeser konten utama.
      // visualisasiTabContainer.classList.remove('pushed-by-sidemenu');
      menuToggleIcon.classList.remove("fa-arrow-left");
      menuToggleIcon.classList.add("fa-bars");

      // Sembunyikan semua menu div dan hapus status aktif saat side menu ditutup
      menuDivs.forEach((div) => div.classList.remove("show"));
      menuItems.forEach((item) => item.classList.remove("active"));
    } else {
      // JIKA MENU SEDANG TERSEMBUNYI, maka ditampilkan;
      sideMenu.classList.add("show-sidemenu");
      mainContent.classList.add("pushed-by-sidemenu");
      // visualisasiTabContainer.classList.add('pushed-by-sidemenu');
      menuToggleIcon.classList.remove("fa-bars");
      menuToggleIcon.classList.add("fa-arrow-left");
    }
  });

  // B. Area Item Side Menu
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      //mengambil id target
      const targetId = item.getAttribute("data-target");
      //mengambil elemen panel menu sesuai dengan id
      const targetDiv = document.getElementById(targetId);

      //Jika tab menu item diaktifkan
      if (item.classList.contains("active")) {
        item.classList.remove("active");
        targetDiv.classList.remove("show");
      } else {
        //Jika tab menu item belum aktif
        menuItems.forEach((menuItem) => menuItem.classList.remove("active"));
        menuDivs.forEach((div) => div.classList.remove("show"));

        item.classList.add("active");
        targetDiv.classList.add("show");
      }
    });
  });

  // C. Tombol Close pada Panel/Tab Sidemenu
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target-close");
      const targetDiv = document.getElementById(targetId);
      const correspondingMenuItem = document.querySelector(
        `.sidemenu-item[data-target="${targetId}"]`
      );

      targetDiv.classList.remove("show");
      if (correspondingMenuItem) {
        correspondingMenuItem.classList.remove("active");
      }
    });
  });

  // D. Tombol Close Tab Visualisasi Data
  visualisasiTabCloseBtn.addEventListener("click", () => {
    visualisasiTabContainer.style.display = "none";
    visualisasiItems = []; // Bersihkan array visualisasi saat tab ditutup
    currentVisualisasiIndex = 0;
  });

  // ===================================================================
  // 4. EVENT LISTENER UNTUK ITEM PADA PANEL SIDE MENU 'LAYER' DI KLIK
  // ===================================================================
  // A. Panel Dropdown Pilihan Basemap ==> Radio Button
  basemapControls.addEventListener("change", (e) => {
    const selectedBasemap = e.target.value;

    if (currentBasemap) {
      map.removeLayer(currentBasemap);
    }

    if (selectedBasemap === "osm") {
      osmLayer.addTo(map);
      currentBasemap = osmLayer;
    } else if (selectedBasemap === "esri-satelit") {
      esriSatelitLayer.addTo(map);
      currentBasemap = esriSatelitLayer;
    } else if (selectedBasemap === "esri-bw") {
      esriGrayCanvas.addTo(map);
      currentBasemap = esriGrayCanvas;
    }
  });

  // B. Panel Dropdown Group Checkbox
  overlayControlGroups.forEach((group) => {
    group.addEventListener("change", async (e) => {
      const layerValue = e.target.value;
      const isChecked = e.target.checked;
      let addedLayer = null;

      if (isChecked) {
        // Check if the layer has been loaded before
        if (!geojsonLayers[layerValue]) {
          const newLayer = await loadGeoJSONLayer(layerValue);
          if (newLayer) {
            geojsonLayers[layerValue] = newLayer;
          }
        }

        if (geojsonLayers[layerValue]) {
          geojsonLayers[layerValue].addTo(map).bringToFront();
          addedLayer = geojsonLayers[layerValue];
          activeLayers.push(addedLayer);
        }
      } else {
        const layerToRemove = geojsonLayers[layerValue];
        if (layerToRemove) {
          map.removeLayer(layerToRemove);
          // Remove the layer from the activeLayers array
          activeLayers = activeLayers.filter(
            (layer) => layer !== layerToRemove
          );
        }
      }

      // Set the current top layer to the last item in the active layers array
      currentTopLayer =
        activeLayers.length > 0 ? activeLayers[activeLayers.length - 1] : null;

      // Update the global variables for each layer
      // GARIS PANTAI
      if (layerValue === "garis-pantai-2016")
        garisPantai2016Layer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "garis-pantai-2017")
        garisPantai2017Layer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "garis-pantai-2018")
        garisPantai2018Layer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "garis-pantai-2019")
        garisPantai2019Layer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "garis-pantai-2020")
        garisPantai2020Layer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "garis-pantai-2021")
        garisPantai2021Layer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "garis-pantai-2022")
        garisPantai2022Layer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "garis-pantai-2023")
        garisPantai2023Layer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "garis-pantai-2024")
        garisPantai2024Layer = isChecked ? geojsonLayers[layerValue] : null;
      //Variabel Kerentanan
      if (layerValue === "slrln")
        slrlnLayer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "waveln")
        waveLayer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "glgln")
        glglnLayer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "slpln")
        slplnLayer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "gmrfln")
        gmrflnLayer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "psln")
        pslnLayer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "scln")
        sclnLayer = isChecked ? geojsonLayers[layerValue] : null;
      //Perubahan Garis Pantai
      if (layerValue === "intrsct")
        intrsctLayer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "bsln")
        bslnLayer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "sctepr")
        scteprLayer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "sctnsm")
        sctnsmLayer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "sctlrr")
        sctlrrLayer = isChecked ? geojsonLayers[layerValue] : null;
      if (layerValue === "scar")
        scarLayer = isChecked ? geojsonLayers[layerValue] : null;
      //Indeks Kerentanan
      if (layerValue === "cviln")
        cvilnLayer = isChecked ? geojsonLayers[layerValue] : null;
      //Batas Administrasi
      if (layerValue === "ardesa")
        ardesaLayer = isChecked ? geojsonLayers[layerValue] : null;

      /// Mengatur isi array activeLayers berdasarkan status checkbox
      if (isChecked) {
        activeLayers.push(layerValue);
      } else {
        activeLayers = activeLayers.filter((item) => item !== layerValue);
      }
      /// INI GA ADA DI FILTER TABEL ///

      /// Mengatur kondisi filter Kec dan Desa berdasarkan isi array dari activeLayers
      if (activeLayers.length > 0) {
        // ini ada isinya
        filterInitialText.style.display = "none";
        kecamatanFilterGroup.style.display = "block";
        desaFilterGroup.style.display = "block";
        updateFilterDropdowns(); //INI DILETAKINNYA DI LUAR IF-ELSE KALAU FILTER-TABEL
      } else {
        // ini tidak ada isinya
        kecamatanFilter.value = "";
        desaFilter.value = "";
        kecamatanFilterGroup.style.display = "none";
        desaFilterGroup.style.display = "none";
        filterInitialText.style.display = "block";
      }

      // berhubungan dengan filter berdasarkan skor
      handleLayerToggle(layerValue, isChecked);
      // berhubungan dengan update isi legenda
      updateLegend();
    });
  });

  // C. Ikon Tabel
  tableIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const layerName = icon.getAttribute("data-layer");
      currentTableLayerName = layerName;
      displayTable(layerName);
    });
  });

  infoIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const layerName = icon.getAttribute("data-layer");
      if (layerName === "sctnsm") {
        // Buka menu Informasi dan tandai sebagai aktif
        menuDivs.forEach((div) => div.classList.remove("show"));
        menuItems.forEach((item) => item.classList.remove("active"));
        const infoMenu = document.getElementById("informasi-menu");
        const infoMenuItem = document.querySelector(
          '.sidemenu-item[data-target="informasi-menu"]'
        );
        infoMenu.classList.add("show");
        infoMenuItem.classList.add("active");
        mainContent.classList.add("pushed-by-sidemenu");
        sideMenu.classList.add("show-sidemenu");
        menuToggleIcon.classList.remove("fa-bars");
        menuToggleIcon.classList.add("fa-arrow-left");
        // Tampilkan teks informasi untuk SLR
        informasiText.innerHTML = `
          <h4 style="font-size: 14px; text-align: center; color: #000000ff;">Net Shoreline Movement</h4>
          <p style="font-size: 13px; text-align: justify; color: #000000ff;"><strong>Net Shoreline Movement (NSM)</strong> 
          adalah pengukuran perubahan posisi garis pantai antara dua waktu yang berbeda. 
          Secara sederhana, ini adalah jarak total seberapa jauh sebuah pantai telah maju (akresi) 
          atau mundur (abrasi) dalam periode tertentu.</p>
          <ol style="font-size: 13px; text-align: justify; color: #000000ff; padding-left: 15px;">
          <li><strong>Abrasi:</strong> Pengikisan daratan oleh gelombang dan arus, yang menyebabkan 
          garis pantai<strong> mundur</strong>.</li>
          <li><strong>Akresi:</strong> Penumpukan sedimen (pasir/lumpur) yang dibawa oleh arus atau 
          sungai, yang menyebabkan garis pantai<strong> maju</strong>ke arah laut.</li>
          </ol>
          <p style="font-size: 13px; text-align: justify; color: #000000ff;"> NSM memberitahu kita proses mana yang lebih dominan. Jika nilai NSM negatif, berarti 
          abrasi lebih besar dan pantai tersebut terkikis. Jika nilainya positif, berarti akresi 
          lebih dominan dan pantai tersebut bertambah luas.</p>`;
        informasiText.style.display = "block";
      } else if (layerName === "sctepr") {
        // Buka menu Informasi dan tandai sebagai aktif
        menuDivs.forEach((div) => div.classList.remove("show"));
        menuItems.forEach((item) => item.classList.remove("active"));
        const infoMenu = document.getElementById("informasi-menu");
        const infoMenuItem = document.querySelector(
          '.sidemenu-item[data-target="informasi-menu"]'
        );
        infoMenu.classList.add("show");
        infoMenuItem.classList.add("active");
        mainContent.classList.add("pushed-by-sidemenu");
        sideMenu.classList.add("show-sidemenu");
        menuToggleIcon.classList.remove("fa-bars");
        menuToggleIcon.classList.add("fa-arrow-left");
        // Tampilkan teks informasi untuk SLR
        informasiText.innerHTML = `
          <h4 style="font-size: 14px; text-align: center; color: #000000ff;">End Point Rate</h4>
          <p style="font-size: 13px; text-align: justify; color: #000000ff;"><strong>End Point Rate (EPR)</strong> 
          adalah salah satu metode statistik yang digunakan dalam Digital 
          Shoreline Analysis System (DSAS) untuk menghitung laju perubahan garis pantai. </p>
          <p style="font-size: 13px; text-align: justify; color: #000000ff;"> Perhitungan EPR dilakukan dengan membagi jarak perubahan atau pergerakan garis pantai 
          dengan rentang waktu antara garis pantai tertua dan terbaru yang terekam. Metode ini 
          secara efektif menunjukkan seberapa cepat pesisir mengalami akresi (penambahan daratan) 
          atau erosi (pengikisan daratan) dalam satuan meter per tahun.
          </p>
          <p style="font-size: 13px; text-align: justify; color: #000000ff;"> Nilai positif dari EPR mengindikasikan terjadinya akresi atau penambahan daratan ke arah 
          laut, sedangkan nilai negatif menunjukkan adanya erosi atau mundurnya garis pantai ke arah 
          daratan. Keunggulan utama dari metode ini adalah kesederhanaan perhitungannya dan kebutuhan 
          data yang minim, yaitu hanya dua data garis pantai dari waktu yang berbeda.".</p>`;
        informasiText.style.display = "block";
      } else if (layerName === "sctlrr") {
        // Buka menu Informasi dan tandai sebagai aktif
        menuDivs.forEach((div) => div.classList.remove("show"));
        menuItems.forEach((item) => item.classList.remove("active"));
        const infoMenu = document.getElementById("informasi-menu");
        const infoMenuItem = document.querySelector(
          '.sidemenu-item[data-target="informasi-menu"]'
        );
        infoMenu.classList.add("show");
        infoMenuItem.classList.add("active");
        mainContent.classList.add("pushed-by-sidemenu");
        sideMenu.classList.add("show-sidemenu");
        menuToggleIcon.classList.remove("fa-bars");
        menuToggleIcon.classList.add("fa-arrow-left");
        // Tampilkan teks informasi untuk SLR
        informasiText.innerHTML = `
          <h4 style="font-size: 14px; text-align: center; color: #000000ff;">Linear Regression Rate</h4>
          <p style="font-size: 13px; text-align: justify; color: #000000ff;"><strong>Linear Regression Rate (LRR)</strong> 
          LRR (Linear Regression Rate)
          LRR adalah tingkat perubahan garis pantai yang dihitung menggunakan metode statistik 
          yang disebut regresi linier. Metode ini menganalisis beberapa posisi garis pantai dari 
          waktu ke waktu (misalnya, dari tahun 1980, 1990, 2000, 2010, dan 2020) untuk menemukan 
          garis tren atau "garis paling cocok" (line of best fit) yang mewakili pergerakan pantai 
          secara keseluruhan.</p>
          <p style="font-size: 13px; text-align: justify; color: #000000ff;">Sederhananya, jika Anda memiliki banyak titik data posisi pantai, LRR akan menarik satu
           garis lurus yang paling mendekati semua titik tersebut. Kemiringan (slope) dari garis 
           lurus inilah yang menjadi nilai LRR, yang menunjukkan kecepatan rata-rata perubahan 
           pantai per tahun.</p>
          <p style="font-size: 13px; text-align: justify; color: #000000ff;"><strong>Perbedaan Utama EPR dan LRR</strong></p> 
          <ol style="font-size: 13px; text-align: justify; color: #000000ff; padding-left: 15px;">
          <li><strong>EPR:</strong> hanya melihat <strong>dua titik data</strong>: titik awal dan titik akhir. 
          Ini seperti hanya melihat di mana perjalanan Anda dimulai dan di mana berakhir, 
          tanpa peduli rute di antaranya</li>
          <li><strong>LRR:</strong> melihat semua <strong>titik data yang tersedia</strong>. Ini memberikan gambaran 
          yang jauh lebih andal dan stabil tentang tren jangka panjang, karena tidak terlalu 
          terpengaruh oleh posisi pantai yang aneh atau tidak biasa di satu tahun tertentu 
          (misalnya, akibat badai sesaat).</li>
          </ol>`;
        informasiText.style.display = "block";
      }
    });
  });

  // ===================================================================
  // 5. FUNGSI - FUNGSI
  // ===================================================================
  // A. Fungsi Untuk Memuat Data GeoJSON
  async function loadGeoJSONLayer(layerName) {
    let geojsonUrl = "";
    let styleFunction;
    let onEachFeatureFunction;

    /// GROUP GARIS PANTAI
    if (layerName === "garis-pantai-2016") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Garis%20Pantai/GP20160309.geojson";
      styleFunction = (feature) => styleGarisPantai(feature, 2016);
    } else if (layerName === "garis-pantai-2017") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Garis%20Pantai/GP20170821.geojson";
      styleFunction = (feature) => styleGarisPantai(feature, 2017);
    } else if (layerName === "garis-pantai-2018") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Garis%20Pantai/GP20180418.geojson";
      styleFunction = (feature) => styleGarisPantai(feature, 2018);
    } else if (layerName === "garis-pantai-2019") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Garis%20Pantai/GP20190508.geojson";
      styleFunction = (feature) => styleGarisPantai(feature, 2019);
    } else if (layerName === "garis-pantai-2020") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Garis%20Pantai/GP20200422.geojson";
      styleFunction = (feature) => styleGarisPantai(feature, 2020);
    } else if (layerName === "garis-pantai-2021") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Garis%20Pantai/GP20210512.geojson";
      styleFunction = (feature) => styleGarisPantai(feature, 2021);
    } else if (layerName === "garis-pantai-2022") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Garis%20Pantai/GP20220402.geojson";
      styleFunction = (feature) => styleGarisPantai(feature, 2022);
    } else if (layerName === "garis-pantai-2023") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Garis%20Pantai/GP20230929.geojson";
      styleFunction = (feature) => styleGarisPantai(feature, 2023);
    } else if (layerName === "garis-pantai-2024") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Garis%20Pantai/GP20240511.geojson";
      styleFunction = (feature) => styleGarisPantai(feature, 2024);
    }
    /// GROUP KERENTANAN
    else if (layerName === "slrln") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Kerentanan/SLRLN.geojson";
      styleFunction = styleVARKERLayer;
    } else if (layerName === "waveln") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Kerentanan/WAVELN.geojson";
      styleFunction = styleVARKERLayer;
    } else if (layerName === "glgln") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Kerentanan/GLGLN.geojson";
      styleFunction = styleVARKERLayer;
    } else if (layerName === "slpln") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Kerentanan/SLPLN.geojson";
      styleFunction = styleVARKERLayer;
    } else if (layerName === "gmrfln") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Kerentanan/GMRFLN.geojson";
      styleFunction = styleVARKERLayer;
    } else if (layerName === "psln") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Kerentanan/PSLN.geojson";
      styleFunction = styleVARKERLayer;
    } else if (layerName === "scln") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Kerentanan/SCLN.geojson";
      styleFunction = styleVARKERLayer;
    }
    /// GROUP PERUBAHAN
    else if (layerName === "intrsct") {
      geojsonUrl =
        "https://github.com/elyueich/leaflet-dashboard/blob/main/data/Perubahan/PointTransect.geojson";
      styleFunction = stylepoint;
    } else if (layerName === "bsln") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Perubahan/Baseline.geojson";
      styleFunction = stylebslnLayer;
    } else if (layerName === "sctepr") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Perubahan/EPRCLIP.geojson";
      styleFunction = styleeprLayer;
    } else if (layerName === "sctnsm") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Perubahan/NSMCLIP.geojson";
      styleFunction = stylensmLayer;
    } else if (layerName === "sctlrr") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Perubahan/LRRCLIP.geojson";
      styleFunction = stylelrrLayer;
    } else if (layerName === "scar") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Perubahan/Area.geojson";
      styleFunction = styleSCARLayer;
    }
    /// GROUP INDEKS KERENTANAN
    else if (layerName === "cviln") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/Kerentanan/KRNTNLN.geojson";
      styleFunction = styleCVILayer;
    }
    /// GROUP Batas Administrasi
    else if (layerName === "ardesa") {
      geojsonUrl =
        "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/ADMIN.geojson";
      styleFunction = styleArdesaLayer;
    }

    /// Pengaturan Pop-Up
    onEachFeatureFunction = (feature, layer, layerName) => {
      if (feature.properties) {
        let popupContent = "<table>";
        for (let key in feature.properties) {
          if (
            feature.properties.hasOwnProperty(key) &&
            feature.properties[key] !== null &&
            feature.properties[key] !== ""
          ) {
            popupContent += `<tr><td><b>${key}</b></td><td>: ${feature.properties[key]}</td></tr>`;
          }
        }

        // Kondisi untuk menampilkan tombol hanya pada layer tertentu
        if (layerName === "slrln" || layerName === "waveln") {
          popupContent += `</table><button class="show-image-btn" data-layer-name="${layerName}">Tampilkan Visualisasi</button>`;
        } 
        // else if (layerName === "cviln") {
        //   popupContent += `</table><button class="show-image-btn" data-layer-name="${layerName}">Tampilkan Informasi</button>`;
        // } 
        else if (layerName === "scar") {
          popupContent += `</table><button class="show-image-btn" data-layer-name="${layerName}">Tampilkan Grafik</button>`;
        } else if (layerName === "sctnsm" || layerName === "sctepr" || layerName === "sctlrr") {
          popupContent += `</table><button class="show-image-btn" data-layer-name="${layerName}">Tampilkan Tabel Ringkasan</button>`;
        } else {
          popupContent += `</table>`;
        }
        layer.bindPopup(popupContent);
      }

      // --- TAMBAHAN BARU UNTUK INTERAKSI PETA KE TABEL ---
      layer.on("click", async function (e) {
        L.DomEvent.stopPropagation(e);
        const featureId = e.target.feature.properties._generated_id; // Ganti UNIQUE_ID

        // Cek apakah tabel yang benar sedang ditampilkan
        // PENTING: Anda harus meneruskan layerName ke selectFeatureById
        if (currentTableLayerName === layerName) {
          selectFeatureById(featureId, layerName);
        } else {
          // HAPUS setTimeout dan ganti dengan await

          // 1. Tunggu sampai tabel SELESAI ditampilkan
          await displayTable(layerName);

          // 2. SETELAH tabel selesai, baru panggil selectFeatureById
          selectFeatureById(featureId, layerName);
        }
      });
      //
    };

    // Fitur loading saat data dimuat
    map.spin(true, {
      lines: 13,
      length: 10,
      width: 5,
      radius: 15,
      scale: 0.5,
    });

    try {
      const response = await fetch(geojsonUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      // Cek apakah data punya features dan belum punya ID buatan
      if (data.features && !data.features[0].properties._generated_id) {
        data.features.forEach((feature, index) => {
          // Buat ID unik dan sisipkan ke dalam properties
          feature.properties._generated_id = `${layerName}-${index}`;
        });
      }

      // Simpan data di cache
      geojsonData[layerName] = data;

      const layer = L.geoJSON(data, {
        style: styleFunction,
        // BERIKAN FUNGSI ANONIM (RESEP) KEPADA LEAFLET
        onEachFeature: (feature, layer) =>
          onEachFeatureFunction(feature, layer, layerName),
      });

      map.spin(false);
      return layer;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      map.spin(false);
      return null;
    }
  }

  // B. Fungsi Untuk Mengatur Simbolisasi Layer Data pada Peta
  // B.1. Garis Pantai
  function styleGarisPantai(feature, year) {
    const selectedKecamatan = kecamatanFilter.value.toLowerCase();
    const selectedDesa = desaFilter.value.toLowerCase();
    const featureKec = (feature.properties.Kec || "").toLowerCase();
    const featureDesa = (feature.properties.Desa || "").toLowerCase();
    let isVisible = true;
    if (selectedKecamatan && featureKec !== selectedKecamatan) {
      isVisible = false;
    }
    if (selectedDesa && featureDesa !== selectedDesa) {
      isVisible = false;
    }
    let color;
    switch (year) {
      case 2016:
        color = "blue";
        break;
      case 2017:
        color = "red";
        break;
      case 2018:
        color = "#800080"; // Ungu
        break;
      case 2019:
        color = "#FFA500"; // Oranye
        break;
      case 2020:
        color = "#008080"; // Teal
        break;
      case 2021:
        color = "#A52A2A"; // Coklat
        break;
      case 2022:
        color = "#FFC0CB"; // Merah Muda
        break;
      case 2023:
        color = "#32CD32"; // Hijau Lemon
        break;
      case 2024:
        color = "#00FFFF"; // Sian
        break;
      default:
        color = "#000000"; // Hitam (default)
    }
    return {
      color: isVisible ? color : "transparent",
      weight: isVisible ? 2 : 0,
      opacity: isVisible ? 1 : 0,
    };
  }
  // B.2. Baseline
  function stylebslnLayer() {
    (color = "#d66ad6ff"), (weight = 1), (opacity = 0.5);
  }
  // B.3. Shore Change --- LRR
  function stylelrrLayer(feature) {
    const selectedKecamatan = kecamatanFilter.value.toLowerCase();
    const selectedDesa = desaFilter.value.toLowerCase();
    const featureKec = (feature.properties.Kec || "").toLowerCase();
    const featureDesa = (feature.properties.Desa || "").toLowerCase();
    let isVisible = true;
    // LOGIKA FILTER ADMINISTRASI
    if (selectedKecamatan && featureKec !== selectedKecamatan) {
      isVisible = false;
    }
    if (selectedDesa && featureDesa !== selectedDesa) {
      isVisible = false;
    }
    // Sisa dari fungsi styleFunction tetap sama...
    const lrr = feature.properties.LRR;
    let color = "#ff0000"; // Default color (Sangat Tinggi)
    if (lrr > 2) {
      color = "#008000"; // Hijau Tua
    } else if (lrr > 1 && lrr <= 2) {
      color = "#00ff00"; // Kuning
    } else if (lrr >= -1 && lrr <= 1) {
      color = "#ffff00"; // Kuning
    } else if (lrr >= -2 && lrr < -1) {
      color = "#ff9900"; // Oranye
    }
    return {
      //Kalau menu skor di atur, maka nilai yang tidak pilih akan diberi warna transparant
      color: isVisible ? color : "transparent",
      weight: isVisible ? 2 : 0,
      opacity: isVisible ? 1 : 0,
    };
  }
  // B.4. Shore Change --- EPR
  function styleeprLayer(feature) {
    const selectedKecamatan = kecamatanFilter.value.toLowerCase();
    const selectedDesa = desaFilter.value.toLowerCase();

    const featureKec = (feature.properties.Kec || "").toLowerCase();
    const featureDesa = (feature.properties.Desa || "").toLowerCase();

    let isVisible = true;

    // LOGIKA FILTER ADMINISTRASI
    if (selectedKecamatan && featureKec !== selectedKecamatan) {
      isVisible = false;
    }
    if (selectedDesa && featureDesa !== selectedDesa) {
      isVisible = false;
    }

    // Sisa dari fungsi styleFunction tetap sama...
    const epr = feature.properties.EPR;
    let color = "#ff0000"; // Default color (Sangat Tinggi)

    if (epr > 2) {
      color = "#008000"; // Hijau Tua
    } else if (epr > 1 && epr <= 2) {
      color = "#00ff00"; // Kuning
    } else if (epr >= -1 && epr <= 1) {
      color = "#ffff00"; // Kuning
    } else if (epr >= -2 && epr < -1) {
      color = "#ff9900"; // Oranye
    }

    return {
      //Kalau menu skor di atur, maka nilai yang tidak pilih akan diberi warna transparant
      color: isVisible ? color : "transparent",
      weight: isVisible ? 2 : 0,
      opacity: isVisible ? 1 : 0,
    };
  }
  // B.5. Shore Change --- NSM
  function stylensmLayer(feature) {
    const selectedKecamatan = kecamatanFilter.value.toLowerCase();
    const selectedDesa = desaFilter.value.toLowerCase();

    const featureKec = (feature.properties.Kec || "").toLowerCase();
    const featureDesa = (feature.properties.Desa || "").toLowerCase();

    let isVisible = true;

    // LOGIKA FILTER ADMINISTRASI
    if (selectedKecamatan && featureKec !== selectedKecamatan) {
      isVisible = false;
    }
    if (selectedDesa && featureDesa !== selectedDesa) {
      isVisible = false;
    }

    // Sisa dari fungsi styleFunction tetap sama...
    const nsm = feature.properties.NSM;
    // let color = "#ff0000"; // Default color (Sangat Tinggi)

    if (nsm > 55) {
      color = "#008000"; // Hijau Tua
    } else if (nsm > 15 && nsm <= 55) {
      color = "#00ff00"; // Kuning
    } else if (nsm >= 15 && nsm <= 0.01) {
      color = "#ffff00"; // Kuning
    } else if (nsm >= -15 && nsm <= 0) {
      color = "#ff9900"; // Oranye
    } else if (nsm < -15) {
      color = "#ff0000"; // Oranye
    }

    return {
      //Kalau menu skor di atur, maka nilai yang tidak pilih akan diberi warna transparant
      color: isVisible ? color : "transparent",
      weight: isVisible ? 2 : 0,
      opacity: isVisible ? 1 : 0,
    };
  }
  // B.6. Area Perubahan
  function styleSCARLayer(feature) {
    const selectedKecamatan = kecamatanFilter.value.toLowerCase();
    const selectedDesa = desaFilter.value.toLowerCase();
    const featureKec = (feature.properties.Kec || "").toLowerCase();
    const featureDesa = (feature.properties.Desa || "").toLowerCase();
    let isVisible = true;
    // LOGIKA FILTER ADMINISTRASI
    if (selectedKecamatan && featureKec !== selectedKecamatan) {
      isVisible = false;
    }
    if (selectedDesa && featureDesa !== selectedDesa) {
      isVisible = false;
    }

    // Sisa dari fungsi styleFunction tetap sama...
    const ketArea = feature.properties.Ket;
    let color = "#ff0000"; // Default color (Sangat Tinggi)
    if (ketArea === "Akresi") {
      color = "#4ca0e9ff"; // Hijau Tua
    } else if (ketArea === "Stabil") {
      // color = "#ffff00"; // Kuning
    }
    return {
      //Kalau menu skor di atur, maka nilai yang tidak pilih akan diberi warna transparant
      color: isVisible ? color : "transparent",
      weight: isVisible ? 2 : 0,
      opacity: isVisible ? 1 : 0,
    };
  }
  // B.7. Variabel Kerentanan --- Skor Layer Data
  function styleVARKERLayer(feature) {
    const selectedKecamatan = kecamatanFilter.value.toLowerCase();
    const selectedDesa = desaFilter.value.toLowerCase();
    const selectedSkor = skorFilter.value; //
    const props = feature.properties;
    const featureKec = (props.Kec || "").toLowerCase();
    const featureDesa = (props.Desa || "").toLowerCase();

    let isVisible = true;

    // LOGIKA FILTER ADMINISTRASI
    if (selectedKecamatan && featureKec !== selectedKecamatan) {
      isVisible = false;
    }
    if (selectedDesa && featureDesa !== selectedDesa) {
      isVisible = false;
    }

    if (!props) return { color: "transparent", weight: 0 };
    // LOGIKA FILTER SKOR
    if (isVisible && selectedSkor && String(props.SKOR) !== selectedSkor)
      isVisible = false;

    // Sisa dari fungsi styleFunction tetap sama...
    const skor = props.SKOR;
    let color = "#ff0000"; // Default color (Sangat Tinggi)

    if (skor == 1) {
      color = "#008000"; // Hijau Tua
    } else if (skor == 2) {
      color = "#00ff00"; // Hijau Muda
    } else if (skor == 3) {
      color = "#ffff00"; // Kuning
    } else if (skor == 4) {
      color = "#ff9900"; // Oranye
    }

    return {
      //Kalau menu skor di atur, maka nilai yang tidak pilih akan diberi warna transparant
      color: isVisible ? color : "transparent",
      weight: isVisible ? 2 : 0,
      opacity: isVisible ? 1 : 0,
    };
  }
  // B.8. Indeks Kerentanan Pesisir --- CVI
  function styleCVILayer(feature) {
    const selectedKecamatan = kecamatanFilter.value.toLowerCase();
    const selectedDesa = desaFilter.value.toLowerCase();
    const selectedCVI = cviFilter.value; // ➕ AMBIL NILAI DARI FILTER cvi

    // const props = feature.properties;
    const featureKec = (feature.properties.Kec || "").toLowerCase();
    const featureDesa = (feature.properties.Desa || "").toLowerCase();
    const featureCVI = feature.properties.Kerentanan;

    let isVisible = true;

    // LOGIKA FILTER ADMINISTRASI
    if (selectedKecamatan && featureKec !== selectedKecamatan) {
      isVisible = false;
    }
    if (selectedDesa && featureDesa !== selectedDesa) {
      isVisible = false;
    }
    if (selectedCVI && featureCVI !== selectedCVI) {
      isVisible = false;
    }

    cvi = feature.properties.Kerentanan;
    let color = "#ff0000"; // Default color (Sangat Tinggi)

    if (cvi === "Sangat Rendah (<3.5)") {
      color = "#008000"; // Hijau Tua
    } else if (cvi === "Rendah (3.5-5.5)") {
      color = "#00ff00"; // Hijau Muda
    } else if (cvi === "Sedang (5.5-8.5)") {
      color = "#ffff00"; // Kuning
    } else if (cvi === "Tinggi (8.5-12.5)") {
      color = "#ff9900"; // Oranye
    }

    return {
      //Kalau menu cvi di atur, maka nilai yang tidak pilih akan diberi warna transparant
      color: isVisible ? color : "transparent",
      weight: isVisible ? 2 : 0,
      opacity: isVisible ? 1 : 0,
    };
  }
  // B.9 Batas Administrasi Desa
  function styleArdesaLayer(feature) {
    const selectedKecamatan = kecamatanFilter.value.toLowerCase();
    const selectedDesa = desaFilter.value.toLowerCase();

    // const props = feature.properties;
    const featureKec = (feature.properties.Kec || "").toLowerCase();
    const featureDesa = (feature.properties.Desa || "").toLowerCase();

    let isVisible = true;

    // LOGIKA FILTER ADMINISTRASI
    if (selectedKecamatan && featureKec !== selectedKecamatan) {
      isVisible = false;
    }
    if (selectedDesa && featureDesa !== selectedDesa) {
      isVisible = false;
    }

    let color = "#24222295"; // Default color (Sangat Tinggi)

    return {
      //Kalau menu cvi di atur, maka nilai yang tidak pilih akan diberi warna transparant
      color: isVisible ? color : "transparent",
      weight: isVisible ? 2 : 0,
      opacity: isVisible ? 1 : 0,
    };
  }

  // C. Fungsi untuk Mengatur Pembaruan Isi Menu Legenda Berdasarkan Layer yang Sedang Aktif
  function updateLegend() {
    legendaContainer.innerHTML = ""; // Bersihkan legenda yang ada

    //Default
    let hasLegend = false;

    const garisPantaiLegends = [];
    const perubahanLegends = [];
    const kerentananLegends = [];

    /// Keterangan untuk Group Garis Pantai ///
    if (garisPantai2016Layer && map.hasLayer(garisPantai2016Layer)) {
      garisPantaiLegends.push({ color: "blue", text: "Garis Pantai 2016" });
    }
    if (garisPantai2017Layer && map.hasLayer(garisPantai2017Layer)) {
      garisPantaiLegends.push({ color: "red", text: "Garis Pantai 2017" });
    }
    if (garisPantai2018Layer && map.hasLayer(garisPantai2018Layer)) {
      garisPantaiLegends.push({ color: "#800080", text: "Garis Pantai 2018" });
    }
    if (garisPantai2019Layer && map.hasLayer(garisPantai2019Layer)) {
      garisPantaiLegends.push({ color: "#FFA500", text: "Garis Pantai 2019" });
    }
    if (garisPantai2020Layer && map.hasLayer(garisPantai2020Layer)) {
      garisPantaiLegends.push({ color: "#008080", text: "Garis Pantai 2020" });
    }
    if (garisPantai2021Layer && map.hasLayer(garisPantai2021Layer)) {
      garisPantaiLegends.push({ color: "#A52A2A", text: "Garis Pantai 2021" });
    }
    if (garisPantai2022Layer && map.hasLayer(garisPantai2022Layer)) {
      garisPantaiLegends.push({ color: "#FFC0CB", text: "Garis Pantai 2022" });
    }
    if (garisPantai2023Layer && map.hasLayer(garisPantai2023Layer)) {
      garisPantaiLegends.push({ color: "#32CD32", text: "Garis Pantai 2023" });
    }
    if (garisPantai2024Layer && map.hasLayer(garisPantai2024Layer)) {
      garisPantaiLegends.push({ color: "#00FFFF", text: "Garis Pantai 2024" });
    }
    /// Keterangan Garis Pantai Berakhir di Sini ///

    //// Keterangan untuk Group Peubahan ////
    if (sctnsmLayer && map.hasLayer(sctnsmLayer)) {
      const sctnsmData = [
        { color: "#008000", text: "> 55 m" },
        { color: "#00ff00", text: "15.01-55 m" },
        { color: "#ffff00", text: "15-0.01 m" },
        { color: "#ff9900", text: "0- (-15) m" },
        { color: "#ff0000", text: "< -15 m" },
      ];
      perubahanLegends.push({
        type: "multiple",
        title: "Jarak Perubahan Garis Pantai (NSM)",
        data: sctnsmData,
      });
    }
    if (scteprLayer && map.hasLayer(scteprLayer)) {
      const scteprData = [
        { color: "#008000", text: "> 5 m/tahun" },
        { color: "#00ff00", text: "2.01 - 5 m/tahun" },
        { color: "#ffff00", text: "2 - 0.01 m/tahun" },
        { color: "#ff9900", text: "0 - (-2) m/tahun" },
        { color: "#ff0000", text: "< -2.01 m/tahun" },
      ];
      perubahanLegends.push({
        type: "multiple",
        title: "Laju Perubahan Garis Pantai (EPR)",
        data: scteprData,
      });
    }
    if (sctlrrLayer && map.hasLayer(sctlrrLayer)) {
      const sctlrrData = [
        { color: "#008000", text: "> 5 m/tahun" },
        { color: "#00ff00", text: "2.01 - 5 m/tahun" },
        { color: "#ffff00", text: "2 - 0.01 m/tahun" },
        { color: "#ff9900", text: "0 - (-2) m/tahun" },
        { color: "#ff0000", text: "< -2.01 m/tahun" },
      ];
      perubahanLegends.push({
        type: "multiple",
        title: "Laju Perubahan Garis Pantai (LRR)",
        data: sctlrrData,
      });
    }
    if (scarLayer && map.hasLayer(scarLayer)) {
      const scarData = [
        { color: "#ff0000", text: "Abrasi" },
        // { color: "#ffff00", text: "Stabil" },
        { color: "#4ca0e9ff", text: "Akresi" },
      ];
      perubahanLegends.push({
        type: "multiple",
        title: "Fenomena Perubahan Area T.2016 dan T.2024",
        data: scarData,
      });
    }
    //// Keterangan untuk Group Perubahan ////

    //// Keterangan untuk Group Kerentanan ////
    if (slplnLayer && map.hasLayer(slplnLayer)) {
      const slplnData = [
        { color: "#008000", text: "Sangat Rendah (> 12%)" },
        { color: "#00ff00", text: "Rendah (9-12%)" },
        { color: "#ffff00", text: "Sedang (6-9%)" },
        { color: "#ff9900", text: "Tinggi (3-6%)" },
        { color: "#ff0000", text: "Sangat Tinggi (< 3%)" },
      ];
      kerentananLegends.push({
        type: "multiple",
        title: "Lereng Pantai",
        data: slplnData,
      });
    }

    if (slrlnLayer && map.hasLayer(slrlnLayer)) {
      kerentananLegends.push({
        type: "single",
        title: "Kenaikan Muka Air Laut",
        data: [
          {
            color: "#FFA500",
            text: "Tinggi 2-4 mm/tahun",
          },
        ],
      });
    }

    if (waveLayer && map.hasLayer(waveLayer)) {
      kerentananLegends.push({
        type: "single",
        title: "Gelombang",
        data: [
          {
            color: "#008000",
            text: "Sangat Rendah (0 - 3 m)",
          },
        ],
      });
    }

    if (glglnLayer && map.hasLayer(glglnLayer)) {
      const glglnData = [
        {
          color: "#008000",
          text: "Sangat Rendah (Batuan Vulkanik)",
        },
        {
          color: "#00ff00",
          text: "Rendah (Batuan Konglomerat)",
        },
        {
          color: "#ffff00",
          text: "Sedang (Batuan Sedimen)",
        },
        { color: "#ff9900", text: "Tinggi (Sedimen Terkonsolidasi)" },
        {
          color: "#ff0000",
          text: "Sangat Tinggi (Sedimen Tak Terkonsolidasi)",
        },
      ];
      kerentananLegends.push({
        type: "multiple",
        title: "Geologi",
        data: glglnData,
      });
    }

    if (gmrflnLayer && map.hasLayer(gmrflnLayer)) {
      const gmrflnData = [
        { color: "#008000", text: "Sangat Rendah" },
        { color: "#00ff00", text: "Rendah" },
        { color: "#ffff00", text: "Sedang" },
        { color: "#ff9900", text: "Tinggi" },
        { color: "#ff0000", text: "Sangat Tinggi" },
      ];
      kerentananLegends.push({
        type: "multiple",
        title: "Geomorfologi",
        data: gmrflnData,
      });
    }

    if (pslnLayer && map.hasLayer(pslnLayer)) {
      kerentananLegends.push({
        type: "single",
        title: "Tunggang Pasang Surut",
        data: [
          {
            color: "#ffff00",
            text: "Sedang (2 - < 4 m)",
          },
        ],
      });
    }

    if (sclnLayer && map.hasLayer(sclnLayer)) {
      const sclnData = [
        { color: "#008000", text: "Sangat Rendah (>2)" },
        { color: "#00ff00", text: "Rendah (1-2)" },
        { color: "#ffff00", text: "Stabil (-1-1)" },
        { color: "#ff9900", text: "Tinggi (-2-(-1))" },
        { color: "#ff0000", text: "Sangat Tinggi (<-2)" },
      ];
      kerentananLegends.push({
        type: "multiple",
        title: "Perubahan Garis Pantai (m/tahun)",
        data: sclnData,
      });
    }

    if (cvilnLayer && map.hasLayer(cvilnLayer)) {
      const cvilnData = [
        { color: "#008000", text: "Sangat Rendah (<3.5)" },
        { color: "#00ff00", text: "Rendah (3.5-5.5)" },
        { color: "#ffff00", text: "Sedang (5.5-8.5)" },
        { color: "#ff9900", text: "Tinggi (8.5 - 12.5))" },
        { color: "#ff0000", text: "Sangat Tinggi (> 12.5)" },
      ];
      kerentananLegends.push({
        type: "multiple",
        title: "Indeks Kerentanan Pesisir",
        data: cvilnData,
      });
    }
    /// Keterangan Kerentanan Berakhir di Sini ///

    /// Ketika terdapat layer group garis pantai yang diaktifkan ///
    if (garisPantaiLegends.length > 0) {
      const garisPantaiDetails = document.createElement("details");
      garisPantaiDetails.className = "legend-details";
      garisPantaiDetails.open = true;
      const garisPantaiSummary = document.createElement("summary");
      garisPantaiSummary.className = "legend-summary";
      garisPantaiSummary.innerHTML = `Garis Pantai <i class="fas fa-chevron-down"></i>`;
      garisPantaiDetails.appendChild(garisPantaiSummary);

      const garisPantaiContent = document.createElement("div");
      garisPantaiContent.className = "legend-dropdown-content";
      garisPantaiLegends.forEach((item) => {
        const legendItem = document.createElement("div");
        legendItem.className = "legend-item";
        legendItem.innerHTML = `
                            <div class="legend-color-box" style="background-color: ${item.color};"></div>
                            <span>${item.text}</span>
                        `;
        garisPantaiContent.appendChild(legendItem);
      });
      garisPantaiDetails.appendChild(garisPantaiContent);
      legendaContainer.appendChild(garisPantaiDetails);
      hasLegend = true; //ada yang ditampilkan
    }

    /// Ketika terdapat layer group perubahan yang diaktifkan ///
    if (perubahanLegends.length > 0) {
      const perubahanDetails = document.createElement("details");
      perubahanDetails.className = "legend-details";
      perubahanDetails.open = true;
      const perubahanSummary = document.createElement("summary");
      perubahanSummary.className = "legend-summary";
      perubahanSummary.innerHTML = `Perubahan Garis Pantai <i class="fas fa-chevron-down"></i>`;
      perubahanDetails.appendChild(perubahanSummary);

      const perubahanContent = document.createElement("div");
      perubahanContent.className = "legend-dropdown-content";
      perubahanLegends.forEach((section) => {
        const sectionDiv = document.createElement("div");
        sectionDiv.className = "legend-section";

        const titleEl = document.createElement("h5");
        titleEl.className = "legend-subsection-title";
        titleEl.textContent = section.title;
        sectionDiv.appendChild(titleEl);

        section.data.forEach((item) => {
          const legendItem = document.createElement("div");
          legendItem.className = "legend-item";
          legendItem.innerHTML = `
                                <div class="legend-color-box" style="background-color: ${item.color};"></div>
                                <span>${item.text}</span>
                            `;
          sectionDiv.appendChild(legendItem);
        });
        perubahanContent.appendChild(sectionDiv);
      });
      perubahanDetails.appendChild(perubahanContent);
      legendaContainer.appendChild(perubahanDetails);
      hasLegend = true;
    }
    /// Ketika terdapat layer group kerentanan yang diaktifkan ///
    if (kerentananLegends.length > 0) {
      const kerentananDetails = document.createElement("details");
      kerentananDetails.className = "legend-details";
      kerentananDetails.open = true;
      const kerentananSummary = document.createElement("summary");
      kerentananSummary.className = "legend-summary";
      kerentananSummary.innerHTML = `Kerentanan Pesisr <i class="fas fa-chevron-down"></i>`;
      kerentananDetails.appendChild(kerentananSummary);

      const kerentananContent = document.createElement("div");
      kerentananContent.className = "legend-dropdown-content";
      kerentananLegends.forEach((section) => {
        const sectionDiv = document.createElement("div");
        sectionDiv.className = "legend-section";

        const titleEl = document.createElement("h5");
        titleEl.className = "legend-subsection-title";
        titleEl.textContent = section.title;
        sectionDiv.appendChild(titleEl);

        section.data.forEach((item) => {
          const legendItem = document.createElement("div");
          legendItem.className = "legend-item";
          legendItem.innerHTML = `
                                <div class="legend-color-box" style="background-color: ${item.color};"></div>
                                <span>${item.text}</span>
                            `;
          sectionDiv.appendChild(legendItem);
        });
        kerentananContent.appendChild(sectionDiv);
      });
      kerentananDetails.appendChild(kerentananContent);
      legendaContainer.appendChild(kerentananDetails);
      hasLegend = true;
    }
    /// Ketika belum ada yang ditampilkan [hasLegend bernilai false]
    if (hasLegend) {
      noLegendText.style.display = "none";
    } else {
      noLegendText.style.display = "block";
    }
  }

  // D. Fungsi untuk Mengatur Pembaruan Isi Menu Filter
  // D.1. Fungsi untuk mengatur pembaruan isi group/dropdown filter kecamatan dan desa berdasarkan layer yang aktif
  function updateFilterDropdowns() {
    const kecSet = new Set();
    const desaSet = new Set();

    activeLayers.forEach((layerName) => {
      const data = geojsonData[layerName];
      if (data) {
        data.features.forEach((feature) => {
          if (feature.properties && feature.properties.Kec) {
            kecSet.add(feature.properties.Kec);
          }
          if (feature.properties && feature.properties.Desa) {
            desaSet.add(feature.properties.Desa);
          }
        });
      }
    });

    const sortedKecamatan = Array.from(kecSet).sort();
    const sortedDesa = Array.from(desaSet).sort();

    kecamatanFilter.innerHTML =
      '<option value="">-- Semua Kecamatan --</option>';
    // memuat dan menyusun isi list dropdown desa dari isi properties Kec
    sortedKecamatan.forEach((kec) => {
      const option = document.createElement("option");
      option.value = kec;
      option.textContent = kec;
      kecamatanFilter.appendChild(option);
    });

    // Tambahkan event listener untuk memfilter desa berdasarkan kecamatan
    kecamatanFilter.onchange = () => {
      const selectedKecamatan = kecamatanFilter.value;
      const filteredDesaSet = new Set();
      if (selectedKecamatan) {
        activeLayers.forEach((layerName) => {
          const data = geojsonData[layerName];
          if (data) {
            data.features.forEach((feature) => {
              if (
                feature.properties &&
                feature.properties.Desa &&
                feature.properties.Kec.toLowerCase() ===
                  selectedKecamatan.toLowerCase()
              ) {
                filteredDesaSet.add(feature.properties.Desa);
              }
            });
          }
        });
      } else {
        sortedDesa.forEach((desa) => filteredDesaSet.add(desa));
      }

      // memuat isi list dropdown desa berdasarkan filter Kec
      // hanya dapat terisi kalau filter Kec sudah dipilih
      const sortedFilteredDesa = Array.from(filteredDesaSet).sort();
      desaFilter.innerHTML = '<option value="">-- Semua Desa --</option>';
      sortedFilteredDesa.forEach((desa) => {
        const option = document.createElement("option");
        option.value = desa;
        option.textContent = desa;
        desaFilter.appendChild(option);
      });
      toggleResetButton();
    };
  }

  // D.2. Fungsi untuk mengatur struktur dan isi dropdown
  // ==> Dapat diterapkan di semua jenis properties, tapi pada website ini hanya untuk properties 'SKOR' dan 'CVI'
  function populateDropdown(element, dataSet, defaultText, prefix = "") {
    if (!element) return;
    const sortedData = Array.from(dataSet).sort((a, b) =>
      typeof a === "number" ? a - b : String(a).localeCompare(String(b))
    );
    element.innerHTML = `<option value="">-- ${defaultText} --</option>`;
    sortedData.forEach((item) => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = `${prefix}${item}`;
      element.appendChild(option);
    });
  }

  // D.2.a. Fungsi untuk mengatur isi dropdown filter 'SKOR' berdasarkan layer yang aktif
  // ==> dipanggil setelah divalidasi kalau layar yang aktif memuat properties 'SKOR'
  function updateSkorFilters() {
    const showSkorFilter = activeLayersWithSkor.length > 0;
    skorFilterGroup.style.display = showSkorFilter ? "block" : "none";

    // Kumpulkan data unik
    const skorSet = new Set();
    const skorActiveLayers = [...new Set([...activeLayersWithSkor])];

    skorActiveLayers.forEach((layerName) => {
      const data = geojsonData[layerName];
      if (data && data.features) {
        data.features.forEach((feature) => {
          const props = feature.properties;
          if (props) {
            if (props.SKOR !== undefined) skorSet.add(props.SKOR);
          }
        });
      }
    });
    populateDropdown(skorFilter, skorSet, "Pilih SKOR", "Skor ");
  }

  // D.2.b. Fungsi untuk mengatur isi dropdown filter 'Kerentanan' berdasarkan layer yang aktif
  // ==> dipanggil setelah divalidasi kalau layar yang aktif memuat properties 'Kerentanan'
  function updateCVIFilters() {
    const showCVIFilter = activeLayersWithCVI.length > 0;
    cviFilterGroup.style.display = showCVIFilter ? "block" : "none";

    // Kumpulkan data unik
    const cviSet = new Set();
    const cviActiveLayers = [...new Set([...activeLayersWithCVI])];

    cviActiveLayers.forEach((layerName) => {
      const data = geojsonData[layerName];
      if (data && data.features) {
        data.features.forEach((feature) => {
          const props = feature.properties;
          if (props) {
            if (props.Kerentanan !== undefined) cviSet.add(props.Kerentanan);
          }
        });
      }
    });
    populateDropdown(
      cviFilter,
      cviSet,
      "Pilih Tingkat Kerentanan",
      "Kerentanan "
    );
  }

  // E. Fungsi untuk mengatur isi Array 'activeLayersWithSkor', dan 'activeLayersWithCVI'
  // ==> dipanggil di 'EVENT LISTENER Group Checkbox'
  function handleLayerToggle(layerValue, isChecked) {
    const data = geojsonData[layerValue];
    // Mendeteksi apakah layer ini punya properti SKOR
    let hasSkorProperty =
      data &&
      data.features &&
      data.features.length > 0 &&
      data.features[0].properties.hasOwnProperty("SKOR");
    // Mendeteksi apakah layer ini punya properti CVI
    let hasKerentananProperty =
      data &&
      data.features &&
      data.features.length > 0 &&
      data.features[0].properties.hasOwnProperty("CVI");

    // Kondisi ketika layer diaktifkan
    if (isChecked) {
      // layer yang memiliki properti 'SKOR' dimasukkan ke array 'activeLayersWithSkor'
      if (hasSkorProperty) activeLayersWithSkor.push(layerValue);
      // layer yang memiliki properti 'CVI' dimasukkan ke array 'activeLayersWithCVI'
      if (hasKerentananProperty) activeLayersWithCVI.push(layerValue);
    } else {
      // Kondisi ketika layer tidak diaktifkan ==> layer dalam array dihapus
      activeLayersWithSkor = activeLayersWithSkor.filter(
        (item) => item !== layerValue
      );
      activeLayersWithCVI = activeLayersWithCVI.filter(
        (item) => item !== layerValue
      );
    }

    // Memanggil dan menjalankan fungsi sesuai dengan pengaturan isi array filter terkiat.
    updateSkorFilters();
    updateCVIFilters();
  }

  // F. Fungsi untuk mengontrol visibilitas tombol reset
  function toggleResetButton() {
    if (
      kecamatanFilter.value !== "" ||
      desaFilter.value !== "" ||
      skorFilter.value !== "" ||
      cviFilter.value !== ""
    ) {
      resetButton.style.display = "block";
    } else {
      resetButton.style.display = "none";
    }

    if (currentTableLayerName) {
      renderTableContent(currentTableLayerName);
    }
  }

  // G. Fungsi untuk mengatur dan memperbarui isi pada panel 'Tabel'
  // G.1. Fungsi untuk menghubungkan kontent 'Tabel' dengan fitur 'Filter' dan 'Selected Layer'
  async function renderTableContent(layerName) {
    tableContent.innerHTML =
      "<p style='text-align: center; color: #777; font-size: 12px;'>Memuat data tabel...</p>";

    if (!geojsonData[layerName]) {
      const layer = await loadGeoJSONLayer(layerName);
      if (!layer) {
        tableContent.innerHTML =
          "<p style='text-align: center; color: red;'>Gagal memuat data tabel.</p>";
        return;
      }
    }

    const data = geojsonData[layerName];
    if (data && data.features && data.features.length > 0) {
      const selectedKecamatan = kecamatanFilter.value.toLowerCase();
      const selectedDesa = desaFilter.value.toLowerCase();
      const selectedSkor = skorFilter.value;
      const selectedCVI = cviFilter.value;

      // Filter data berdasarkan kriteria yang dipilih
      const filteredFeatures = data.features.filter((feature) => {
        const props = feature.properties;
        const featureKec = (props.Kec || "").toLowerCase();
        const featureDesa = (props.Desa || "").toLowerCase();
        const featureSkor = String(props.SKOR || "");
        const featureCVI = props.Kerentanan;

        let isVisible = true;
        if (selectedKecamatan && featureKec !== selectedKecamatan) {
          isVisible = false;
        }
        if (selectedDesa && featureDesa !== selectedDesa) {
          isVisible = false;
        }
        if (selectedSkor && featureSkor !== selectedSkor) {
          isVisible = false;
        }
        if (selectedCVI && featureCVI !== selectedCVI) {
          isVisible = false;
        }
        return isVisible;
      });

      if (filteredFeatures.length > 0) {
        const headers = Object.keys(filteredFeatures[0].properties);
        let tableHtml = "<table><thead><tr>";
        headers.forEach((header) => {
          tableHtml += `<th>${header}</th>`;
        });
        tableHtml += "</tr></thead><tbody>";

        filteredFeatures.forEach((feature) => {
          // tableHtml += "<tr>";
          const uniqueId = feature.properties._generated_id; // <-- GUNAKAN ID BARU
          tableHtml += `<tr data-feature-id="${uniqueId}">`;
          headers.forEach((header) => {
            const value = feature.properties[header];
            tableHtml += `<td>${value !== null ? value : ""}</td>`;
          });
          tableHtml += "</tr>";
        });
        tableHtml += "</tbody></table>";
        tableContent.innerHTML = tableHtml;
      } else {
        tableContent.innerHTML =
          "<p style='text-align: center; color: #777; font-size: 12px;'>Tidak ada data yang cocok dengan filter saat ini.</p>";
      }
    } else {
      tableContent.innerHTML =
        "<p style='text-align: center; color: #777; font-size: 12px;'>Tidak ada data untuk layer ini.</p>";
    }
  }

  // G.2. Fungsi untuk menampilkan panel tabel dari renderTableContent
  async function displayTable(layerName) {
    const tabelMenuDiv = document.getElementById("tabel-menu");
    const tabelMenuItem = document.querySelector(
      '.sidemenu-item[data-target="tabel-menu"]'
    );

    menuItems.forEach((item) => item.classList.remove("active"));
    menuDivs.forEach((div) => div.classList.remove("show"));
    tabelMenuItem.classList.add("active");
    tabelMenuDiv.classList.add("show");

    await renderTableContent(layerName);
    // resetHighlights();
  }

  // G.3. Fungsi untuk mereset/menghapus semua highlight yang aktif, baik di peta maupun di tabel.
  function resetHighlights() {
    // Reset highlight di peta berdasarkan state yang tersimpan
    if (selectionState.layer && selectionState.layerName) {
      const parentLayer = geojsonLayers[selectionState.layerName];
      if (parentLayer) {
        // Reset style menggunakan layer induk yang benar
        parentLayer.resetStyle(selectionState.layer);
      }
    }

    // Reset highlight di tabel
    if (lastSelectedTableRow) {
      lastSelectedTableRow.classList.remove("selected-row");
    }

    // Kosongkan state setelah reset
    selectionState.layer = null;
    selectionState.layerName = null;
    lastSelectedTableRow = null;
  }

  // G.4. Fungsi untuk menyorot feature di peta dan baris di tabel berdasarkan ID unik.
  // ==> @param {string|number} featureId - ID unik dari feature.
  function selectFeatureById(featureId, layerName) {
    resetHighlights(); // Selalu bersihkan highlight lama sebelum memulai yang baru

    const targetLayer = geojsonLayers[layerName];
    if (!targetLayer) {
      console.error(
        "Layer " + layerName + " tidak ditemukan di cache geojsonLayers."
      );
      return;
    }

    // 1. Sorot di Peta
    targetLayer.eachLayer(function (layer) {
      if (layer.feature.properties._generated_id == featureId) {
        layer.setStyle(highlightStyle);
        layer.bringToFront();
        map.fitBounds(layer.getBounds(), {
          paddingTopLeft: [350, 50],
          maxZoom: 16,
        });

        // --- SIMPAN STATUS SELEKSI YANG BARU ---
        selectionState.layer = layer;
        selectionState.layerName = layerName;
      }
    });

    // 2. Sorot di Tabel
    const tableRow = document.querySelector(
      `#table-content tr[data-feature-id="${featureId}"]`
    );
    // --- TAMBAHKAN DEBUGGING DI SINI ---
    console.log("Mencari baris tabel untuk ID:", featureId);
    console.log("Elemen baris yang ditemukan:", tableRow);
    if (tableRow) {
      // 1. Tambahkan kelas CSS ke baris yang ditemukan
      tableRow.classList.add("selected-row");

      // 2. Simpan referensi baris ini ke variabel global
      lastSelectedTableRow = tableRow;

      // (Opsional) Scroll ke baris tersebut
      tableRow.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  // H. Fungsi untuk mengatur tampilan dan isi Panel Tab Visualisasi
  // H.1. Fungsi untuk menampilkan visualisasi
  function renderVisualisasi() {
    visualisasiTabContent.innerHTML = "";

    // Show/hide navigation buttons based on the number of items
    if (visualisasiItems.length > 1) {
      prevBtn.style.display = "block";
      nextBtn.style.display = "block";
    } else {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    }

    if (visualisasiItems.length === 0) {
      visualisasiTabContent.innerHTML =
        '<p style="text-align: center; color: #777;">Tidak ada visualisasi untuk ditampilkan.</p>';
      return;
    }

    const item = visualisasiItems[currentVisualisasiIndex];
    visualisasiTabTitle.textContent = item.title;

    const innerContent = document.createElement("div");
    innerContent.className = "visualisasi-tab-content-inner";

    if (item.type === "image-comparison") {
      const comparisonWrapper = document.createElement("div");
      comparisonWrapper.className = "image-comparison";

      const image1 = document.createElement("img");
      image1.src = item.image1.url;
      image1.alt = item.image1.alt;

      const image2Wrapper = document.createElement("div");
      image2Wrapper.className = "image-comparison-wave";
      const image2 = document.createElement("img");
      image2.src = item.image2.url;
      image2.alt = item.image2.alt;
      image2Wrapper.appendChild(image2);

      const slider = document.createElement("div");
      slider.className = "image-comparison-slider";

      comparisonWrapper.appendChild(image1);
      comparisonWrapper.appendChild(image2Wrapper);
      comparisonWrapper.appendChild(slider);
      innerContent.appendChild(comparisonWrapper);

      let isDragging = false;
      slider.addEventListener("mousedown", (e) => {
        e.preventDefault();
        isDragging = true;
      });
      document.addEventListener("mouseup", () => {
        isDragging = false;
      });
      document.addEventListener("mousemove", (e) => {
        if (isDragging) {
          const rect = comparisonWrapper.getBoundingClientRect();
          let newX = e.clientX - rect.left;
          if (newX < 0) newX = 0;
          if (newX > rect.width) newX = rect.width;

          const percentage = (newX / rect.width) * 100;
          image2Wrapper.style.width = `${percentage}%`;
          slider.style.left = `${percentage}%`;
        }
      });
    } else if (item.type === "image") {
      const imageWrapper = document.createElement("div");
      imageWrapper.className = "image-wrapper";
      const img = document.createElement("img");
      img.className = "visualisasi-image";
      img.src = item.url;
      img.alt = item.title;
      imageWrapper.appendChild(img);

      const controls = document.createElement("div");
      controls.className = "image-controls zoom-only";
      controls.innerHTML = `
                        <button class="image-control-btn zoom-in-btn"><i class="fas fa-plus"></i></button>
                        <button class="image-control-btn zoom-out-btn"><i class="fas fa-minus"></i></button>
                        <button class="image-control-btn reset-zoom-btn"><i class="fas fa-sync-alt"></i></button>
                    `;
      innerContent.appendChild(imageWrapper);
      innerContent.appendChild(controls);

      let currentZoom = 1.0;
      let panX = 0;
      let panY = 0;
      let isDragging = false;
      let startX, startY;
      const updateImageTransform = () => {
        img.style.transform = `scale(${currentZoom}) translate(${panX}px, ${panY}px)`;
      };
      controls.querySelector(".zoom-in-btn").addEventListener("click", () => {
        currentZoom += 0.2;
        updateImageTransform();
      });
      controls.querySelector(".zoom-out-btn").addEventListener("click", () => {
        if (currentZoom > 1.0) {
          currentZoom -= 0.2;
          updateImageTransform();
        }
      });
      controls
        .querySelector(".reset-zoom-btn")
        .addEventListener("click", () => {
          currentZoom = 1.0;
          panX = 0;
          panY = 0;
          updateImageTransform();
        });
      imageWrapper.addEventListener("mousedown", (e) => {
        if (currentZoom > 1.0) {
          isDragging = true;
          imageWrapper.classList.add("is-dragging");
          startX = e.clientX - panX;
          startY = e.clientY - panY;
        }
      });
      imageWrapper.addEventListener("mousemove", (e) => {
        if (isDragging) {
          panX = e.clientX - startX;
          panY = e.clientY - startY;
          updateImageTransform();
        }
      });
      imageWrapper.addEventListener("mouseup", () => {
        isDragging = false;
        imageWrapper.classList.remove("is-dragging");
      });
      imageWrapper.addEventListener("mouseleave", () => {
        isDragging = false;
        imageWrapper.classList.remove("is-dragging");
      });
    }

    visualisasiTabContent.appendChild(innerContent);
    updateNavButtons();
  }

  // H.2. Fungsi untuk memperbarui status tombol navigasi
  function updateNavButtons() {
    if (visualisasiItems.length > 1) {
      prevBtn.style.display = "block";
      nextBtn.style.display = "block";
      prevBtn.disabled = currentVisualisasiIndex === 0;
      nextBtn.disabled =
        currentVisualisasiIndex === visualisasiItems.length - 1;
    } else {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    }
  }

  // ===================================================================
  // 6. EVENT LISTENER UNTUK ITEM PADA PANEL 'FILTER' DIKLIK
  // ===================================================================
  // A. Filter Kecamatan
  // ==> Memperbarui isi panel tabel dan visualisasi layer features sesuai style simbolisasi masing-masing layer.
  kecamatanFilter.addEventListener("change", () => {
    if (currentTableLayerName) {
      renderTableContent(currentTableLayerName);
    }
    /// Group Garis Pantai
    if (garisPantai2016Layer) {
      garisPantai2016Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2016)
      );
    }
    if (garisPantai2017Layer) {
      garisPantai2017Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2017)
      );
    }
    if (garisPantai2018Layer) {
      garisPantai2018Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2018)
      );
    }
    if (garisPantai2019Layer) {
      garisPantai2019Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2019)
      );
    }
    if (garisPantai2020Layer) {
      garisPantai2020Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2020)
      );
    }
    if (garisPantai2021Layer) {
      garisPantai2021Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2021)
      );
    }
    if (garisPantai2022Layer) {
      garisPantai2022Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2022)
      );
    }
    if (garisPantai2023Layer) {
      garisPantai2023Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2023)
      );
    }
    if (garisPantai2024Layer) {
      garisPantai2024Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2024)
      );
    }
    /// Group Perubahan
    if (sctlrrLayer) {
      sctlrrLayer.setStyle(stylelrrLayer);
    }
    if (scteprLayer) {
      scteprLayer.setStyle(styleeprLayer);
    }
    if (sctnsmLayer) {
      sctnsmLayer.setStyle(stylensmLayer);
    }
    if (scarLayer) {
      scarLayer.setStyle(styleSCARLayer);
    }
    /// Group Kerentanan
    if (slplnLayer) {
      slplnLayer.setStyle(styleVARKERLayer);
    }
    if (glglnLayer) {
      glglnLayer.setStyle(styleVARKERLayer);
    }
    if (gmrflnLayer) {
      gmrflnLayer.setStyle(styleVARKERLayer);
    }
    if (pslnLayer) {
      pslnLayer.setStyle(styleVARKERLayer);
    }
    if (slrlnLayer) {
      slrlnLayer.setStyle(styleVARKERLayer);
    }
    if (sclnLayer) {
      sclnLayer.setStyle(styleVARKERLayer);
    }
    if (waveLayer) {
      waveLayer.setStyle(styleVARKERLayer);
    }
    if (cvilnLayer) {
      cvilnLayer.setStyle(styleCVILayer);
    }
    /// Group ADMIN
    if (ardesaLayer) {
      ardesaLayer.setStyle(styleArdesaLayer);
    }
    toggleResetButton();
  });

  // B. Filter Desa
  // ==> Memperbarui isi panel tabel dan visualisasi layer features sesuai style simbolisasi masing-masing layer.
  desaFilter.addEventListener("change", () => {
    if (currentTableLayerName) {
      renderTableContent(currentTableLayerName);
    }
    /// Group ADMIN
    if (ardesaLayer) {
      ardesaLayer.setStyle(styleArdesaLayer);
    }
    /// Group Garis Pantai
    if (garisPantai2016Layer) {
      garisPantai2016Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2016)
      );
    }
    if (garisPantai2017Layer) {
      garisPantai2017Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2017)
      );
    }
    if (garisPantai2018Layer) {
      garisPantai2018Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2018)
      );
    }
    if (garisPantai2019Layer) {
      garisPantai2019Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2019)
      );
    }
    if (garisPantai2020Layer) {
      garisPantai2020Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2020)
      );
    }
    if (garisPantai2021Layer) {
      garisPantai2021Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2021)
      );
    }
    if (garisPantai2022Layer) {
      garisPantai2022Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2022)
      );
    }
    if (garisPantai2023Layer) {
      garisPantai2023Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2023)
      );
    }
    if (garisPantai2024Layer) {
      garisPantai2024Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2024)
      );
    }
    /// Group Perubahan
    if (sctlrrLayer) {
      sctlrrLayer.setStyle(stylelrrLayer);
    }
    if (scteprLayer) {
      scteprLayer.setStyle(styleeprLayer);
    }
    if (sctnsmLayer) {
      sctnsmLayer.setStyle(stylensmLayer);
    }
    if (scarLayer) {
      scarLayer.setStyle(styleSCARLayer);
    }
    /// Group Kerentanan
    if (slplnLayer) {
      slplnLayer.setStyle(styleVARKERLayer);
    }
    if (glglnLayer) {
      glglnLayer.setStyle(styleVARKERLayer);
    }
    if (gmrflnLayer) {
      gmrflnLayer.setStyle(styleVARKERLayer);
    }
    if (pslnLayer) {
      pslnLayer.setStyle(styleVARKERLayer);
    }
    if (slrlnLayer) {
      slrlnLayer.setStyle(styleVARKERLayer);
    }
    if (sclnLayer) {
      sclnLayer.setStyle(styleVARKERLayer);
    }
    if (waveLayer) {
      waveLayer.setStyle(styleVARKERLayer);
    }
    if (cvilnLayer) {
      cvilnLayer.setStyle(styleCVILayer);
    }
    toggleResetButton();
  });

  // C. Filter SKOR
  // ==> Memperbarui isi panel tabel dan visualisasi layer features sesuai style simbolisasi masing-masing layer.
  skorFilter.addEventListener("change", () => {
    if (currentTableLayerName) {
      renderTableContent(currentTableLayerName);
    }
    if (slplnLayer) {
      slplnLayer.setStyle(styleVARKERLayer);
    }
    if (glglnLayer) {
      glglnLayer.setStyle(styleVARKERLayer);
    }
    if (gmrflnLayer) {
      gmrflnLayer.setStyle(styleVARKERLayer);
    }
    if (pslnLayer) {
      pslnLayer.setStyle(styleVARKERLayer);
    }
    if (slrlnLayer) {
      slrlnLayer.setStyle(styleVARKERLayer);
    }
    if (sclnLayer) {
      sclnLayer.setStyle(styleVARKERLayer);
    }
    if (waveLayer) {
      waveLayer.setStyle(styleVARKERLayer);
    }

    toggleResetButton();
  });

  // D. Filter CVI
  // ==> Memperbarui isi panel tabel dan visualisasi layer features sesuai style simbolisasi masing-masing layer.
  cviFilter.addEventListener("change", () => {
    if (currentTableLayerName) {
      renderTableContent(currentTableLayerName);
    }
    if (cvilnLayer) {
      cvilnLayer.setStyle(styleCVILayer);
    }
    toggleResetButton();
  });

  // E. Tombol Reset
  resetButton.addEventListener("click", () => {
    // Reset nilai dropdown
    kecamatanFilter.value = "";
    desaFilter.value = "";
    skorFilter.value = "";
    cviFilter.value = "";

    // Perbarui tampilan dropdown desa (untuk menghapus opsi filter sebelumnya)
    kecamatanFilter.dispatchEvent(new Event("change"));

    ///SEPERTINYA INI DIGANTI SAMA FUNGSI RENDER DEHH....
    // Terapkan gaya kembali ke semua fitur di layer garis pantai
    /// Group ADMIN
    if (ardesaLayer) {
      ardesaLayer.setStyle(styleArdesaLayer);
    }
    if (garisPantai2016Layer) {
      garisPantai2016Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2016)
      );
    }
    if (garisPantai2017Layer) {
      garisPantai2017Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2017)
      );
    }
    if (garisPantai2018Layer) {
      garisPantai2018Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2018)
      );
    }
    if (garisPantai2019Layer) {
      garisPantai2019Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2019)
      );
    }
    if (garisPantai2020Layer) {
      garisPantai2020Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2020)
      );
    }
    if (garisPantai2021Layer) {
      garisPantai2021Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2021)
      );
    }
    if (garisPantai2022Layer) {
      garisPantai2022Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2022)
      );
    }
    if (garisPantai2023Layer) {
      garisPantai2023Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2023)
      );
    }
    if (garisPantai2024Layer) {
      garisPantai2024Layer.setStyle((feature) =>
        styleGarisPantai(feature, 2024)
      );
    }
    /// Group Perubahan
    if (sctlrrLayer) {
      sctlrrLayer.setStyle(stylelrrLayer);
    }
    if (scteprLayer) {
      scteprLayer.setStyle(styleeprLayer);
    }
    if (sctnsmLayer) {
      sctnsmLayer.setStyle(stylensmLayer);
    }
    if (scarLayer) {
      scarLayer.setStyle(styleSCARLayer);
    }
    // Terapkan gaya kembali ke semua fitur di layer kerentanan
    if (slplnLayer) {
      slplnLayer.setStyle(styleVARKERLayer);
    }
    if (glglnLayer) {
      glglnLayer.setStyle(styleVARKERLayer);
    }
    if (gmrflnLayer) {
      gmrflnLayer.setStyle(styleVARKERLayer);
    }
    if (pslnLayer) {
      pslnLayer.setStyle(styleVARKERLayer);
    }
    if (slrlnLayer) {
      slrlnLayer.setStyle(styleVARKERLayer);
    }
    if (sclnLayer) {
      sclnLayer.setStyle(styleVARKERLayer);
    }
    if (waveLayer) {
      waveLayer.setStyle(styleVARKERLayer);
    }
    if (cvilnLayer) {
      cvilnLayer.setStyle(styleCVILayer);
    }
    toggleResetButton();
  });

  // ===================================================================
  // 6. EVENT LISTENER UNTUK ITEM PADA PANEL 'SLIDER' DIGERAKKAN
  // ===================================================================
  transparencySlider.addEventListener("input", (e) => {
    const opacity = e.target.value / 100;

    // Cek layer teratas yang saat ini aktif dan terapkan opasitas
    if (currentTopLayer && map.hasLayer(currentTopLayer)) {
      currentTopLayer.setStyle({
        opacity: opacity,
      });
    }
  });

  // ===================================================================
  // 7. EVENT LISTENER UNTUK ITEM PADA PANEL 'TABEL' DIKLIK
  // ===================================================================
  // A. Ketika baris data pada tabel diklik
  tableContent.addEventListener("click", (e) => {
    const targetRow = e.target.closest("tr");
    if (targetRow && targetRow.dataset.featureId) {
      const featureId = targetRow.dataset.featureId;
      // Panggil dengan menyertakan nama layer tabel yang sedang aktif
      selectFeatureById(featureId, currentTableLayerName);
    }
  });

  // ===================================================================
  // 7. EVENT LISTENER UNTUK TOMBOL PADA TOP BAR
  // ===================================================================
  // A. Tombol Geolokasi
  geolocationBtn.addEventListener("click", () => {
    if ("geolocation" in navigator) {
      map.spin(true, {
        lines: 13,
        length: 10,
        width: 5,
        radius: 15,
        scale: 0.5,
      });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          map.spin(false);
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const accuracy = position.coords.accuracy;
          const latlng = [lat, lon];

          // Hapus marker dan lingkaran sebelumnya jika ada
          if (locationMarker) {
            map.removeLayer(locationMarker);
          }
          if (accuracyCircle) {
            map.removeLayer(accuracyCircle);
          }

          // Tambahkan marker ke lokasi
          locationMarker = L.marker(latlng, {
            icon: L.icon({
              iconUrl:
                "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              tooltipAnchor: [16, -28],
              shadowUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
              shadowSize: [41, 41],
            }),
            className: "geolocation-marker",
          })
            .addTo(map)
            .bindPopup(`<b>Lokasi Anda</b><br>Akurasi: ${accuracy} meter`)
            .openPopup();

          // Tambahkan lingkaran akurasi
          accuracyCircle = L.circle(latlng, accuracy, {
            color: "blue",
            fillColor: "#3b82f6",
            fillOpacity: 0.2,
            weight: 2,
          }).addTo(map);

          // Pindahkan peta ke lokasi
          map.setView(latlng, 15);
        },
        (error) => {
          map.spin(false);
          console.error("Error getting location:", error.message);
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Akses lokasi ditolak.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Informasi lokasi tidak tersedia.";
              break;
            case error.TIMEOUT:
              errorMessage = "Waktu permintaan lokasi habis.";
              break;
            default:
              errorMessage = "Terjadi kesalahan yang tidak diketahui.";
              break;
          }
          alert(`Gagal mendapatkan lokasi Anda.\nError: ${errorMessage}`);
        }
      );
    } else {
      alert("Geolokasi tidak didukung oleh browser ini.");
    }
  });

  // B. Tombol Fullscreen
  fullscreenBtn.addEventListener("click", () => {
    const mapContainer = map.getContainer();
    const icon = fullscreenBtn.querySelector("i");

    if (document.fullscreenElement) {
      document.exitFullscreen();
      icon.className = "fas fa-expand";
    } else {
      mapContainer.requestFullscreen();
      icon.className = "fas fa-compress";
    }
  });

  // ===================================================================
  // 8. EVENT LISTENER UNTUK TOMBOL PADA TAB/PANEL VISUALISASI
  // ===================================================================
  // A. Tombol Sebelumnya
  prevBtn.addEventListener("click", () => {
    if (currentVisualisasiIndex > 0) {
      currentVisualisasiIndex--;
      renderVisualisasi();
    }
  });

  // B. Tombol Setelahnya
  nextBtn.addEventListener("click", () => {
    if (currentVisualisasiIndex < visualisasiItems.length - 1) {
      currentVisualisasiIndex++;
      renderVisualisasi();
    }
  });

  // C. Menambahkan fungsionalitas drag-and-drop pada tab visualisasi
  // C.1. Deklarasi variabel drag-and-drop
  let isDraggingVisualisasi = false;
  let offset = {
    x: 0,
    y: 0,
  };

  // C.2. Ketika tombol mouse diklik di atas suatu elemen
  visualisasiTabHeader.addEventListener("mousedown", (e) => {
    isDraggingVisualisasi = true;
    visualisasiTabContainer.classList.add("is-dragging");
    offset.x = e.clientX - visualisasiTabContainer.offsetLeft;
    offset.y = e.clientY - visualisasiTabContainer.offsetTop;
  });

  // C.3. Ketika tombol mouse dilepaskan setelah ditekan/diklik
  document.addEventListener("mouseup", () => {
    isDraggingVisualisasi = false;
    visualisasiTabContainer.classList.remove("is-dragging");
  });

  // C.3. Ketika mouse diklik dan kursor digerakkan bersamaan
  document.addEventListener("mousemove", (e) => {
    if (isDraggingVisualisasi) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;

      visualisasiTabContainer.style.left = `${newX}px`;
      visualisasiTabContainer.style.top = `${newY}px`;
      visualisasiTabContainer.style.transform = "none";
    }
  });

  // ===================================================================
  // 8. EVENT LISTENER UNTUK ELEMENT PADA DIV PETA
  // ===================================================================
  // A. Tombol di dalam POPUP
  map.on("popupopen", function () {
    // A.1. Tombol Khusus DSAS
    const nsm = document.querySelector(".show-nsm-btn");
    if (nsm) {
      nsm.addEventListener("click", () => {
        const layerName = nsm.getAttribute("data-layer-name");
        if (layerName === "sctlrr") {
          // Buka menu Informasi dan tandai sebagai aktif
          menuDivs.forEach((div) => div.classList.remove("show"));
          menuItems.forEach((item) => item.classList.remove("active"));
          const infoMenu = document.getElementById("informasi-menu");
          const infoMenuItem = document.querySelector(
            '.sidemenu-item[data-target="informasi-menu"]'
          );
          infoMenu.classList.add("show");
          infoMenuItem.classList.add("active");
          mainContent.classList.add("pushed-by-sidemenu");
          sideMenu.classList.add("show-sidemenu");
          menuToggleIcon.classList.remove("fa-bars");
          menuToggleIcon.classList.add("fa-arrow-left");
          // Tampilkan teks informasi untuk SLR
          informasiText.innerHTML = `
          <h4>Net Shoreline Movement</h4>
          <p><strong>Net Shoreline Movement (NSM)</strong> 
          adalah pengukuran perubahan posisi garis pantai antara dua waktu yang berbeda. 
          Secara sederhana, ini adalah jarak total seberapa jauh sebuah pantai telah maju (akresi) 
          atau mundur (abrasi) dalam periode tertentu.</p>
          <ol>
          <li><strong>Abrasi:</strong> Pengikisan daratan oleh gelombang dan arus, yang menyebabkan 
          garis pantai<strong> mundur</strong>.</li>
          <li><strong>Akresi:</strong> Penumpukan sedimen (pasir/lumpur) yang dibawa oleh arus atau 
          sungai, yang menyebabkan garis pantai<strong> maju</strong>ke arah laut.</li>
          </ol>
          <p> NSM memberitahu kita proses mana yang lebih dominan. Jika nilai NSM negatif, berarti 
          abrasi lebih besar dan pantai tersebut terkikis. Jika nilainya positif, berarti akresi 
          lebih dominan dan pantai tersebut bertambah luas.</p>`;
          visualisasiContainer.style.display = "none";
          informasiText.style.display = "block";
        }
        // Open the tab and render the first item
        visualisasiTabContainer.style.display = "flex";
        currentVisualisasiIndex = 0;
        renderVisualisasi();
      });
    }

    const epr = document.querySelector(".show-epr-btn");
    if (epr) {
      epr.addEventListener("click", () => {
        const layerName = epr.getAttribute("data-layer-name");
        if (layerName === "sctepr") {
          // Buka menu Informasi dan tandai sebagai aktif
          menuDivs.forEach((div) => div.classList.remove("show"));
          menuItems.forEach((item) => item.classList.remove("active"));
          const infoMenu = document.getElementById("informasi-menu");
          const infoMenuItem = document.querySelector(
            '.sidemenu-item[data-target="informasi-menu"]'
          );
          infoMenu.classList.add("show");
          infoMenuItem.classList.add("active");
          mainContent.classList.add("pushed-by-sidemenu");
          sideMenu.classList.add("show-sidemenu");
          menuToggleIcon.classList.remove("fa-bars");
          menuToggleIcon.classList.add("fa-arrow-left");
          // Tampilkan teks informasi untuk SLR
          informasiText.innerHTML = `
          <h4>End Point Rate</h4>
          <p style='text-align: justify;'><strong>End Point Rate (EPR)</strong> 
          adalah salah satu metode statistik yang digunakan dalam Digital 
          Shoreline Analysis System (DSAS) untuk menghitung laju perubahan garis pantai. </p>
          <p style='text-align: justify;> Perhitungan EPR dilakukan dengan membagi jarak perubahan atau pergerakan garis pantai 
          dengan rentang waktu antara garis pantai tertua dan terbaru yang terekam. Metode ini 
          secara efektif menunjukkan seberapa cepat pesisir mengalami akresi (penambahan daratan) 
          atau erosi (pengikisan daratan) dalam satuan meter per tahun.
          </p>
          <p style='text-align: justify;> Nilai positif dari EPR mengindikasikan terjadinya akresi atau penambahan daratan ke arah 
          laut, sedangkan nilai negatif menunjukkan adanya erosi atau mundurnya garis pantai ke arah 
          daratan. Keunggulan utama dari metode ini adalah kesederhanaan perhitungannya dan kebutuhan 
          data yang minim, yaitu hanya dua data garis pantai dari waktu yang berbeda.".</p>`;
          visualisasiContainer.style.display = "none";
          informasiText.style.display = "block";
        }
        // Open the tab and render the first item
        visualisasiTabContainer.style.display = "flex";
        currentVisualisasiIndex = 0;
        renderVisualisasi();
      });
    }

    const lrr = document.querySelector(".show-lrr-btn");
    if (lrr) {
      lrr.addEventListener("click", () => {
        const layerName = lrr.getAttribute("data-layer-name");
        if (layerName === "sctlrr") {
          // Buka menu Informasi dan tandai sebagai aktif
          menuDivs.forEach((div) => div.classList.remove("show"));
          menuItems.forEach((item) => item.classList.remove("active"));
          const infoMenu = document.getElementById("informasi-menu");
          const infoMenuItem = document.querySelector(
            '.sidemenu-item[data-target="informasi-menu"]'
          );
          infoMenu.classList.add("show");
          infoMenuItem.classList.add("active");
          mainContent.classList.add("pushed-by-sidemenu");
          sideMenu.classList.add("show-sidemenu");
          menuToggleIcon.classList.remove("fa-bars");
          menuToggleIcon.classList.add("fa-arrow-left");
          // Tampilkan teks informasi untuk SLR
          informasiText.innerHTML = `
          <h4>Linear Regression Rate</h4>
          <p><strong>Linear Regression Rate (LRR)</strong> 
          LRR (Linear Regression Rate)
          LRR adalah tingkat perubahan garis pantai yang dihitung menggunakan metode statistik 
          yang disebut regresi linier. Metode ini menganalisis beberapa posisi garis pantai dari 
          waktu ke waktu (misalnya, dari tahun 1980, 1990, 2000, 2010, dan 2020) untuk menemukan 
          garis tren atau "garis paling cocok" (line of best fit) yang mewakili pergerakan pantai 
          secara keseluruhan.</p>
          <p>Sederhananya, jika Anda memiliki banyak titik data posisi pantai, LRR akan menarik satu
           garis lurus yang paling mendekati semua titik tersebut. Kemiringan (slope) dari garis 
           lurus inilah yang menjadi nilai LRR, yang menunjukkan kecepatan rata-rata perubahan 
           pantai per tahun.</p>
          <ol>
          <p><strong>Perbedaan Utama EPR dan LRR</strong></p> 
          <li><strong>EPR:</strong> hanya melihat <strong>dua titik data</strong>: titik awal dan titik akhir. 
          Ini seperti hanya melihat di mana perjalanan Anda dimulai dan di mana berakhir, 
          tanpa peduli rute di antaranya</li>
          <li><strong>LRR:</strong> melihat semua <strong>titik data yang tersedia</strong>. Ini memberikan gambaran 
          yang jauh lebih andal dan stabil tentang tren jangka panjang, karena tidak terlalu 
          terpengaruh oleh posisi pantai yang aneh atau tidak biasa di satu tahun tertentu 
          (misalnya, akibat badai sesaat).</li>
          </ol>`;
          visualisasiContainer.style.display = "none";
          informasiText.style.display = "block";
        }
        // Open the tab and render the first item
        visualisasiTabContainer.style.display = "flex";
        currentVisualisasiIndex = 0;
        renderVisualisasi();
      });
    }

    // A.2. Tombol Visualisasi Data
    const btn = document.querySelector(".show-image-btn");
    if (btn) {
      btn.addEventListener("click", () => {
        const slrCheckbox = document.querySelector('input[value="slrln"]');
        const waveCheckbox = document.querySelector('input[value="waveln"]');
        const scarCheckbox = document.querySelector('input[value="scar"]');
        const nsmCheckbox = document.querySelector('input[value="sctnsm"]');
        const eprCheckbox = document.querySelector('input[value="sctepr"]');
        const lrrcheckbox = document.querySelector('input[value="sctlrr"]');

        // Clear the visualization items and populate based on checkboxes
        visualisasiItems = [];

        if (slrCheckbox.checked) {
          visualisasiItems.push({
            type: "image",
            title: "Visualisasi Data SLR",
            url: "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/GAMBAR/Visualisasi%20Trend%20SLR%20INT10.png",
          });
        }
        if (waveCheckbox.checked) {
          visualisasiItems.push({
            type: "image",
            title: "Visualisasi Data WAVE",
            url: "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/GAMBAR/Visualisasi%20Mean%20Wave%20INT10.png",
          });
        }
        if (scarCheckbox.checked) {
          visualisasiItems.push({
            type: "image",
            title: "Visualisasi Data Area Perubahan",
            url: "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/refs/heads/main/data/GAMBAR/Grafik%20perubahan%20luas%20area.png",
          });
        }
        if (nsmCheckbox.checked) {
          visualisasiItems.push({
            type: "image",
            title: "Tabel Persebaran Transek Berdasarkan nilai statistik NSM",
            url: "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/GAMBAR/NSM.png",
          });
        }
        if (eprCheckbox.checked) {
          visualisasiItems.push({
            type: "image",
            title: "Tabel Persebaran Transek Berdasarkan nilai statistik EPR",
            url: "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/main/data/GAMBAR/EPR.png",
          });
        }
        if (lrrcheckbox.checked) {
          visualisasiItems.push({
            type: "image",
            title: "Tabel Persebaran Transek Berdasarkan nilai statistik LRR",
            url: "https://raw.githubusercontent.com/elyueich/leaflet-dashboard/refs/heads/main/data/GAMBAR/LRR.png",
          });
        }

        // Open the tab and render the first item
        visualisasiTabContainer.style.display = "flex";
        currentVisualisasiIndex = 0;
        renderVisualisasi();
      });
    }
  });

  // B. Event click pada div koordinat: Mengaktifkan fungsionalitas
  coordDisplay.addEventListener("click", function () {
    isListening = !isListening; // Toggle status
    if (isListening) {
      coordDisplay.innerHTML =
        '<i class="fa-solid fa-location-crosshairs"></i>';
      coordDisplay.style.backgroundColor = "gray";
      coordDisplay.style.color = "white";
      map.dragging.enable(); // Pastikan peta bisa digeser
    } else {
      coordDisplay.innerHTML =
        '<i class="fa-solid fa-location-crosshairs"></i>';
      coordDisplay.style.backgroundColor = "white";
      coordDisplay.style.color = "black";
      isCoordLocked = false; // Pastikan kunci dilepas
      if (currentMarker) {
        map.removeLayer(currentMarker);
        currentMarker = null;
      }
    }
  });

  // C. Event mousemove: Tampilkan koordinat
  map.on("mousemove", function (e) {
    if (isListening && !isCoordLocked) {
      var lat = e.latlng.lat.toFixed(4);
      var lng = e.latlng.lng.toFixed(4);
      coordDisplay.innerHTML =
        "<i class='fa-solid fa-location-crosshairs'></i> " + lat + ", " + lng;
    }
  });

  // D. Kursor klik layer apa saja setelah fitur selected layer aktif
  map.on("click", function (e) {
    if (isListening) {
      if (currentMarker) {
        map.removeLayer(currentMarker);
      }

      isCoordLocked = true;
      var lat = e.latlng.lat.toFixed(4);
      var lng = e.latlng.lng.toFixed(4);
      coordDisplay.innerHTML =
        "<i class='fa-solid fa-location-crosshairs'></i> " + lat + ", " + lng;

      currentMarker = L.marker(e.latlng).addTo(map);

      var popupContent =
        "<i class='fa-solid fa-location-crosshairs'></i> (" +
        lat +
        ", " +
        lng +
        ')<br><div id="remove-marker-btn"><i class="fa-solid fa-trash"></i></div>';
      currentMarker.bindPopup(popupContent).openPopup();

      // Listener untuk tombol hapus
      currentMarker.on("popupopen", function () {
        document
          .getElementById("remove-marker-btn")
          .addEventListener("click", function () {
            if (currentMarker) {
              map.removeLayer(currentMarker);
              currentMarker = null;
              isCoordLocked = false;
              isListening = false; // Nonaktifkan setelah dihapus
              coordDisplay.innerHTML =
                '<i class="fa-solid fa-location-crosshairs"></i>';
              coordDisplay.style.backgroundColor = "white";
              coordDisplay.style.color = "black";
            }
          });
      });

      // Listener untuk penutupan popup
      currentMarker.on("popupclose", function () {
        isCoordLocked = false;
      });
    }

    // Cek jika target klik BUKAN sebuah feature (poligon, garis, dll.)
    if (!e.originalEvent.target.classList.contains("leaflet-interactive")) {
      // Jika klik di area kosong, panggil fungsi reset
      resetHighlights();
    }
  });
  // E. Event contextmenu (klik kanan): Lepas kunci
  map.on("contextmenu", function () {
    isCoordLocked = false;
    // Bersihkan marker atau lakukan aksi lain jika perlu
  });
});

