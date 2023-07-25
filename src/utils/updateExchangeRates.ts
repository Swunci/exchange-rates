/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import Decimal from 'decimal.js';
import fetch from 'node-fetch';
import schedule from 'node-schedule';
import { setTimeout } from 'timers/promises';

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
  const lastestDate = `${date.getFullYear()}-${
    date.getMonth() + 1 < 10 ? '0' : ''
  }${date.getMonth() + 1}-${date.getDate() + 2 < 10 ? '0' : ''}${
    date.getDate() + 1
  }`;
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
  let successCounter = 0;
  let loopCounter = 0;
  let start = new Date('2010-01-01');
  const end = new Date('2011-01-01');
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
    await setTimeout(3000);
    const response = await fetch(
      `http://api.currencylayer.com/historical?date=${lastestDate}&access_key=5e1c9400386d9e9d5f274a5b0ba6bf1a`,
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

export { job, populatePreviousDataJob };
