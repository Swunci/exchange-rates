import mongoose, { Schema } from 'mongoose';

export const ExchangeRates = mongoose.model(
  'exchange-rates',
  new Schema({
    date: { type: String, unique: true },
    exchangeRates: String,
  }),
);
