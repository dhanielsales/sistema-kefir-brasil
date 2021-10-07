import { Client, Order, Trader, Types } from './types';
import { createTextPlainContent } from './PlainText'

interface CreatePDFProps {
  type?: "plain_text";
  order: Order;
  client: Client;
  trader: Trader;
}

export function createContent({order, client, trader, type = "plain_text"}: CreatePDFProps) {
  const method = createPdfTypes[Types.PLAIN_TEXT]
  
  const content = method(order, client, trader)

  return content
}

const createPdfTypes = {
  "plain_text": createTextPlainContent
};