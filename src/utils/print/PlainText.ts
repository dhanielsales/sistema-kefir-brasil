import { Client, Order, Trader } from './types';
import { centralizeText, formatAddress, formatAmount, formatProductsHeader, includeSpace, justifiyText } from './utils'

export const createTextPlainContent = (order: Order, client: Client, trader: Trader, maxCharLine = 40) => {
  const header = formatHeader(client, trader)
  const footer = formatFooter(order, trader)
  const orderProducts = formatProducts(order)

  const invoiceTextPlain = `${header}${orderProducts}${footer}`;
  
    return invoiceTextPlain;
};

function formatHeader(client: Client, trader: Trader, maxCharLine = 40) {
  const header = `
${centralizeText(trader.name)}
    
${client.name ? `Nome: ${client.name.substring(0, Number(maxCharLine - 6))}`: ""}
${client.phone ? `Telefone: ${client.phone}`: ""}
${client.address ? `Endereço: ${formatAddress(client.address, 10)}`: ""}
`

  return header
}

function formatProducts(order: Order, maxCharLine = 40, maxCharProds = 15) {
  let orderProducts = `
${'-'.repeat(maxCharLine)}
${centralizeText(`PEDIDO #${order.id}`)}
${'-'.repeat(maxCharLine)}
${formatProductsHeader()}
`;

  order.products.forEach((product) => {
    const productAmount = formatAmount(Number(product.amount).toFixed(2));
    const productAmountTotalAmount = formatAmount((Number(product.amount) * product.quantity).toFixed(2));
    
    let productData = `# ${product.name.substring(0, maxCharProds).toLowerCase()}`;

    if (productData.length < maxCharProds + 2) {
      const diff = maxCharProds + 4 - productData.length
      productData += includeSpace(diff + 2)
    } else {
      productData += includeSpace(2)
    }

    productData += `${product.quantity}${includeSpace(2)}${productAmount}${includeSpace(2)}${productAmountTotalAmount}\n`;
    
    orderProducts += productData;
  });

  return orderProducts;
}

function formatFooter(order: Order, trader: Trader, maxCharLine = 40) {
  const footer = `
${justifiyText('Total Produtos:', `${formatAmount(Number(order.total).toFixed(2))}`)}
${justifiyText('Desconto:', `${formatAmount(Number(order.discount).toFixed(2))}`)}
${justifiyText('Subtotal:', `${formatAmount(Number(order.subtotal).toFixed(2))}`)}
${justifiyText('Total a pagar:', `${formatAmount(Number(order.subtotal).toFixed(2))}`)}
${justifiyText('Forma de pagamento:',`${order.paymentMethod.substring(0, 17)}`)}

*CONTROLE DE PEDIDO PARA SIMPLES
CONFERÊNCIA

*ATENÇÃO: Em caso de desacordo com o TIPO
solicitado, entre em contato conosco para
procedimento de TROCA, NÃO abra a embalagem
ou utiliza o starter enviado erroneamente, 
pois nesse caso haverá PERDA DE GARANTIA de 
novo envio.

${centralizeText(`${trader.name.toUpperCase()} - ${trader.site}`)}

. 
`

  return footer
}

// *ATENÇÃO: Em caso de desacordo com
// o TIPO solicitado, entre em contato 
// conosco para procedimento de TROCA, 
// NÃO abra a embalagem ou utiliza o 
// starter enviado erroneamente, pois 
// nesse caso haverá PERDA DE GARANTIA 
// de novo envio.