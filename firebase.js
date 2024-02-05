var admin = require("firebase-admin");
const firebase = admin.initializeApp({
    credential: admin.credential.cert({
            "type": "service_account",
            "project_id": "car-rental-9b4a5",
            "private_key_id": "0627d48d0c3b68d2f90f4d9ecea670ed3c91cd6f",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDfC16HliHHjUm9\nPe5oeVL6y2497Tjh7FFT+Vy91PKhAm8HKHuA652b5lCZoNMWPs/ccbhuICr7ODDJ\nzUVCxaFW8ZtrbkGAGBR09uA35uXBoUKBO2ZiYtZ/rV20aEO0AgjiGQH0rxO/aHpB\nHt8XhzcpyJZoGfji0DfYdMyfk4AemeYLANYFfFmD5Ns0ujRDFwDGZ2JIq6BoxUv4\nIs1vSzTNo8hRQSia+NVpqxyK57ZSqPJgZaKz0Z5qJlgqvUz4KTza+y/nlYAlbcgz\nkDbp/KnGw1g26e++Lmx95oUrM4I55W6ZjxGAzqfcsuNgD+YdfZuX/MarnjQ/BSNL\nrhbAJtf3AgMBAAECggEACra1F7YycS9sN1beOM57Gejjpr3aWZ/MWEhGGCg+b1V6\nl9Ft/UdUDsUFYhvDh/IEcgZUYZXR+rc8QLVHemmb0l1Qpdxp8Qk3Elc5dfX1W1Ov\nqh18UYWF4CQnuB66Ac+HNbUVzvcJ78vI84/UD4FDORKVhvKYbeyqgg86NQAUy2Nq\nHZthlnj9R2HTuJ71IZ01Pw+4ZP3pZCyj/kOZdwtQZ7fx/l1BB/SH6j8X+Udc7oyb\nSDoJRimGqEYu+GbV+sSPy3G5XI0PmnQ41XDUzPvkKdBb7CqWz/wytBn7Skn7tOKU\nzapS3exPxPDng7XVNLiYwfVY1JG2tI61KU7iVxYmgQKBgQD2tNuOosyodu5eqYYr\ny4mq6hND4Es87IashUrb6IPnjNg9kY3IuWyUazRAwzS6MfaCerpF4sP9OVm+0U0t\nQXQd8owCbwCP7BRlTtr6nIe7DIydEUzroUB5PKypT4u9eIVR40XInpYtQv3g+rfw\nqPFSzqVZYpKmh2iAUqcSO2gyxwKBgQDnclLiZWd/k7QzewvhYt5sm9fnYGHSPPlS\nxSyKMiQNk2Oi9RvXKaJiRchTITTrYfRSOnY4Cw082y4/CPILamJKK6UcC71C4tZa\noEM0BdZszLZtXGHlpu5h09/N2UZYhvaVDDuUVHZ4i/2C1XUo99Ef6wAGA41m0tIr\nRCotWCQBUQKBgQCJZHuJ2hyEDYf+7AYuybGnn6iO+pCsI0V1Ot5PzhP3ljavQypl\nCO7xUSrOjmgE8eJJFDQ8y2c+1PuoC0Qh2fvi2bsjd9ImVOGe8eV+AEKO5xRAPOxL\npYgUfLfjqss1/7KvwhSQ/9C+8DoXW0mpG00aQr9PIlhtqaeHH4Cv5KnI7QKBgHEh\nHoZvDpH7fp+TS5FVpGbuHjCImggLqcrdehHqxFimbJNgv8UCIs9qUKrhll5fuO7g\niJyIOmY+tHI3SyhtTbH3d3MoAdDJ1ADkSTUKjW8M+Tana2q3l9nVmJWj2JC5F5pv\nKkgsqOPveXEUKXpm959kXNSTs/BIqFZhsUQMyzyhAoGBAIVf5MrcX791uEyvg2qR\nUnqBQaTlnv2EhpaDsB4+9+KkqczvcL3xfft+dvEL9Rno++ePeXe1d8k/lfayWL7m\nsy/NZubOMXH9uLWgv5SW8cu0I7gGtTJx9FpzK3kgnJ2pPcoh9l9b7NacMQu8882e\nCvZ37dyh3Zzclf2727RbINy3\n-----END PRIVATE KEY-----\n",
            "client_email": "firebase-adminsdk-hg09z@car-rental-9b4a5.iam.gserviceaccount.com",
            "client_id": "116543778439290570183",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-hg09z%40car-rental-9b4a5.iam.gserviceaccount.com",
            "universe_domain": "googleapis.com"
          
    })
});

module.exports = firebase