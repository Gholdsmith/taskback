// const { json } = require('express');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors, json } = format;

const myFormat = printf(({ level, message, timestamp, stack }) => 
{
    return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
    level: 'info', //niveau de log par defaut
    format: combine(
        timestamp(),
        errors({ stack: true}), //log les erreurs avec leur stacks
        json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'app.log', level:'info' }),
        new transports.File({ filename: 'error.log', level:'error' }),
    ]
});


module.exports = logger;