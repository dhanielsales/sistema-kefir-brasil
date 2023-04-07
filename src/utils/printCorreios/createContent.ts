import { Client, Order, Trader } from './types';
import { createTextPlainContent } from './PlainText'

interface CreatePDFProps {
  type?: "plain_text";
  order: Order;
  client: Client;
  trader: Trader;
}

export function createContentCorreios({order, client, trader, type = "plain_text"}: CreatePDFProps) {
  const method = createPdfTypes[type]

  const content = method(order, client, trader)

  return content
}

const createPdfTypes = {
  "plain_text": createTextPlainContent
};