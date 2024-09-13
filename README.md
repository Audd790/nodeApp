# Absen Rajawali dan Psikotes   

### Requirements  
- node.js versi 4.x.x  
- mysql versi 8.x.x  
- pm2 versi 5.4.2 (untuk production)
- nodemon versi 3.1.4 (untuk production)

### Cara Install  
1. Install node.js dari link berikut --> https://nodejs.org/en/download/package-manager
2. Install mysql dari link berikut --> https://dev.mysql.com/downloads/installer/
1. Download kode dari github
2. Ketik `npm install` di command prompt/powershell dalam folder yang ada projeknya, untuk install semua modul yang diperlukan untuk jalan program

### Cara Run 

Jalan projek untuk development pakai nodemon dan production dengan pm2  

#### Jalan pakai nodemon  

1. Install nodemon dengan mengetik `npm install -g nodemon`
2. Untuk jalan program, pindah ke folder projek dan ketik `nodemon`
3. Untuk hentikan, pakai command `ctrl+C`

Untuk info lebih lengkap tentang nodemon: https://www.npmjs.com/package/nodemon

#### Jalan pakai pm2   

1. Install pm2 dengan ketik `npm install pm2@latest -g` di command prompt/powershell.
2. Untuk jalan program ketik `pm2 start [path to projek]/bin/www`
3. Untuk hentikan, ketik `pm2 stop [path to projek]/bin/www`

Untuk info lebih lengkap tentang pm2: https://pm2.keymetrics.io/docs/usage/quick-start/
