const express = require('express');
const fs = require('node:fs');
const morgan = require('morgan');
const path = require('node:path');

const app = express();

// Logging middleware.
app.use(morgan('combined'))

app.get('/', (req, res) => {
    res.send('Hello world — serveur volontairement non optimisé mais fonctionnel');
});


app.get('/big', (req, res) => {
    const filePath = path.join(__dirname, 'maybe-big-file.txt');
    if (fs.existsSync(filePath)) {
        const stream = fs.createReadStream(filePath);

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');

        stream.pipe(res);

        stream.on('error', (err) => {
            console.error('File streaming error:', err);

            if (!res.headersSent) {
                res.status(500).send('Erreur lors de la lecture du fichier');
            } else {
                res.destroy(err);
            }
        });
    } else {
        res.send('Fichier introuvable');
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});