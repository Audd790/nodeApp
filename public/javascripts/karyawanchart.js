const karyawanctx = document.getElementById('karyawanChart').getContext('2d');
var inputKaryawan = document.getElementById("karyawan")
var listNama
const currDate = new Date();
const month = ['Januari', 
    'Febuari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember']

const karyawanChart = new Chart(karyawanctx, {
    type: 'bar',
    data: {
        labels: month.slice(0, currDate.getMonth()+1),
        datasets: [{label: 'Total Menit telat setiap bulan'}]
    },
    options: {
        maintainAspectRatio: false,
        layout: {padding: 30},
        plugins: {
            colors: {forceOverride: true },
            legend:{
                labels:{
                    font:{size:14}} }},
        scales: {
            x: {beginAtZero: true,},
            y: {beginAtZero: true}
        }
    }

});

window.addEventListener('beforeprint', () => {
    karyawanChart.resize(600, 600);
});
window.addEventListener('afterprint', () => {
    karyawanChart.resize();
});

$.ajax({
    url : "palingTelat",
    type: "GET",
    success: (data, textStatus, jqXHR)=>{
        console.log(data.sql);
        $('#palingTelat').append(data.sql[0].nama)
    },
    error:(data, textStatus, jqXHR)=>{
        console.error('Error:', textStatus)
} })