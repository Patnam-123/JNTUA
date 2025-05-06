const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.post('/api/user', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    res.status(201).json({ message: `user ${name} created` });
});

module.exports = app;
