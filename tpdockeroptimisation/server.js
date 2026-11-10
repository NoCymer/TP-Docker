const express = require('express');
const morgan = require('morgan');
const http = require('node:http');

const app = express();

// Logging middleware.
app.use(morgan('combined'))

app.get('/', (req, res) => {
    res.send('Hello world — serveur volontairement non optimisé mais fonctionnel');
});


app.get('/big', (req, res) => {
    const fileUrl = `${process.env.FILE_SERVER_URL}/maybe-big-file.txt`;

    const upstream = http.get(fileUrl, (fileRes) => {
        res.status(fileRes.statusCode || 502);

        res.setHeader(
            'Content-Type',
            fileRes.headers['content-type'] || 'application/octet-stream'
        );

        fileRes.pipe(res);
    });

    upstream.on('error', (err) => {
        console.error('File server error:', err);

        if (!res.headersSent) {
            res.status(502).send('File server unavailable');
        } else {
            res.destroy(err);
        }
    });

    res.on('close', () => {
        if (!upstream.destroyed) {
            upstream.destroy();
        }
    });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});