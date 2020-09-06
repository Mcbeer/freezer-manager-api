const express = require('express');
const { logger } = require('./src/utils/logger');

const app = express();

app.get('/', (req, res) => {
	res.json({ Hello: 'world!' });
});

app.listen(process.env.PORT, () => {
	logger.info(`Now listening on ${8000}`);
});
