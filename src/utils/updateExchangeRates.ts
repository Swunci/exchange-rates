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

const populatePreviousDataJob = async () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 2);

  let successCounter = 0;
  let loopCounter = 0;

  while (start <= end) {
    const lastestDate = start.toISOString().split('T')[0];

    // Check if exists first
    const exists = await ExchangeRates.findOne({ date: lastestDate });
    if (exists) {
      console.log('Already exists:', lastestDate);
      successCounter += 1;
      loopCounter += 1;
      start.setDate(start.getDate() + 1);
      continue;
    }

    const response = await fetch(
      `http://api.currencylayer.com/live?access_key=a908aa9294fad9ff1d4357112ecff4d2`,
      { method: 'GET' },
    );

    if (response.ok) {
      const data = await response.json();
      const exchangeRates = parseData(data.quotes);
      console.log(
        'Parsed rates:',
        Object.keys(exchangeRates).length,
        'currencies',
      );
      console.log('Creating document for date:', lastestDate);
      await ExchangeRates.create({
        date: lastestDate,
        exchangeRates: JSON.stringify(exchangeRates),
      });
      successCounter += 1;
    }

    start.setDate(start.getDate() + 1);
    loopCounter += 1;
  }

  console.log(`Success: ${successCounter}/${loopCounter}`);
};
export { job, populatePreviousDataJob };
