/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import Decimal from 'decimal.js';
import fetch from 'node-fetch';
import schedule from 'node-schedule';

import { ExchangeRates } from '../api/v1/models/ExchangeRates';

interface ApiResponse {
  success: string;
  terms: string;
  privacy: string;
  historical: boolean;
  date: string;
  timestamp: number;
  source: string;
  quotes: Object;
}

function parseData(quotes: Object) {
  const map = new Map<string, Decimal>();
  [...Object.entries(quotes)].forEach(([key, value]) => {
    const currencyCode = key.replace('USD', '');
    map.set(currencyCode, new Decimal(value));
  });
  return Object.fromEntries(map.entries());
}

const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
rule.tz = 'Etc/GMT-14';

const job = schedule.scheduleJob(rule, async () => {
  console.log('JOB IS STARTING');
  const date = new Date();
  const lastestDate = new Date(date.setDate(date.getDate() + 1))
    .toISOString()
    .split('T')[0];
  const document = await ExchangeRates.findOne({ date: lastestDate });
  if (document) {
    console.log('already created');
    return;
  }
  const response = await fetch(
    `http://api.currencylayer.com/live?access_key=a908aa9294fad9ff1d4357112ecff4d2`,
    { method: 'GET' },
  );
  if (response.ok) {
    const data = await response.json();
    const exchangeRates = parseData((data as ApiResponse).quotes);
    const record = await ExchangeRates.create({
      date: lastestDate,
      exchangeRates: JSON.stringify(exchangeRates),
    });
    if (record) {
      console.log('record created');
    }
  }
  console.log('JOB IS ENDING');
});

const pingRenderServerJob = schedule.scheduleJob('*/10 * * * *', async () => {
  console.log('pinging server');
  const response = await fetch(`https://exchange-rates-d1x0.onrender.com`, {
    method: 'GET',
  });
  console.log(response.ok);
});

const populatePreviousDataJob = async () => {
  let successCounter = 0;
  let loopCounter = 0;
  let start = new Date('2023-07-26');
  const end = new Date('2023-07-27');
  while (start <= end) {
    const date = start;
    const lastestDate = date.toISOString().split('T')[0];
    const document = await ExchangeRates.findOne({ date: lastestDate });
    if (document) {
      start = new Date(date.setDate(date.getDate() + 1));
      successCounter += 1;
      loopCounter += 1;
      console.log('already created');
      continue;
    }
    const response = await fetch(
      `http://api.currencylayer.com/live?access_key=a908aa9294fad9ff1d4357112ecff4d2`,
      { method: 'GET' },
    );
    if (response.ok) {
      const data = await response.json();
      const exchangeRates = parseData((data as ApiResponse).quotes);
      const record = await ExchangeRates.create({
        date: lastestDate,
        exchangeRates: JSON.stringify(exchangeRates),
      });
      if (record) {
        console.log('record created');
        successCounter += 1;
      }
    }
    start = new Date(date.setDate(date.getDate() + 1));
    loopCounter += 1;
  }
  console.log(`${successCounter} total: ${loopCounter}`);
  console.log('JOB IS ENDING');
};

export { job, pingRenderServerJob, populatePreviousDataJob };
