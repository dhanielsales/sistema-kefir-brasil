import { Client, Order, Trader } from './types';
import { alingRightText, centralizeText, formatAddress, formatAmount, formatProductsHeader, includeSpace, justifiyText } from './utils'

export const createTextPlainContent = (order: Order, client: Client, trader: Trader, maxCharLine = 47) => {
  const header = formatHeader(client, trader)
  const footer = formatFooter(order, trader)
  const orderProducts = formatProducts(order)

  const invoiceTextPlain = `
    ${header}
    ${orderProducts}
    ${footer}
    `;
  
    return invoiceTextPlain;
};

function formatHeader(client: Client, trader: Trader, maxCharLine = 47) {
  const header = 
    `<html><body>
    <!-- Vendedor -->
    ${centralizeText(trader.name)}<br />
    ${trader.cnpj ? `CNPJ: ${trader.cnpj}<br />`: ""}
    ${trader.phone ? `Telefone: ${trader.phone}<br />`: ""}
    ${trader.address ? `Endereço: ${formatAddress(trader.address, 10)}<br />`: ""}
    <!-- Cliente -->
    ${'-'.repeat(maxCharLine)}<br />
    ${centralizeText('DADOS DO CLIENTE')}<br />
    ${'-'.repeat(maxCharLine)}<br />
    ${client.name ? `Nome: ${client.name.substring(0, Number(maxCharLine - 6))}<br />`: ""}
    ${client.cpf ? `CPF: ${client.cpf}<br />`: ""}
    ${client.phone ? `Telefone: ${client.phone}<br />`: ""}
    ${client.address ? `Endereço: ${formatAddress(client.address, 10)}<br />`: ""}
    `

  return header
}

function formatProducts(order: Order, maxCharLine = 47) {
  let orderProducts = `
    ${'-'.repeat(maxCharLine)}<br />
    ${centralizeText(`PEDIDO #${order.id}`)}<br />
    ${'-'.repeat(maxCharLine)}<br />
    ${formatProductsHeader()}
  `;

  order.products.forEach((product) => {
    const productAmount = formatAmount(Number(product.amount).toFixed(2));
    const productAmountTotalAmount = formatAmount((Number(product.amount) * product.quantity).toFixed(2));
    
    let productData = `# ${product.name.substring(0, Number(maxCharLine) - 2)}<br />`;
    productData += `${alingRightText(`${product.quantity}${includeSpace(3)}${productAmount}${includeSpace(3)}${productAmountTotalAmount}`)}<br />`;
    
    orderProducts += productData;
  });

  return orderProducts;
}

function formatFooter(order: Order, trader: Trader, maxCharLine = 47) {
  const footer = 
    `
    ${justifiyText('Total Produtos:', `${formatAmount(Number(order.total).toFixed(2))}`)}<br />
    ${justifiyText('Desconto:', `${formatAmount(Number(order.discount).toFixed(2))}`)}<br />
    ${justifiyText('Subtotal:', `${formatAmount(Number(order.subtotal).toFixed(2))}`)}<br />
    ${justifiyText('Total a pagar:', `${formatAmount(Number(order.total - order.discount).toFixed(2))}`)}<br />
    ${justifiyText('Forma de pagamento:',`${order.paymentMethod}`)}<br />
    ${centralizeText(`${trader.name} ${trader.site}`)}<br />
    ${'-'.repeat(maxCharLine)}<br />
    *CONTROLE DE PEDIDO PARA SIMPLES<br />
    CONFERÊNCIA<br /><br />

    *ATENÇÃO: Em caso de desacordo com o TIPO<br />
    solicitado, entre em contato conosco para<br />
    procedimento de TROCA, NÃO abra a embalagem<br />
    ou utiliza o starter enviado erroneamente, pois<br />
    nesse caso haverá PERDA DE GARANTIA de novo envio.
    </body>
    </html>
    `

  return footer
}