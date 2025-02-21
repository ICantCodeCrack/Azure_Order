const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

require("dotenv").config();

const tableName = "Orders";
const account = "brtablestorage";
const accountKey = process.env.AZURE_STORAGE_KEY;

const credential = new AzureNamedKeyCredential(account, accountKey);
const tableClient = new TableClient(
  `https://${account}.table.core.windows.net`,
  tableName,
  credential
);

async function saveOrder(order) {
  await tableClient.createEntity({
    partitionKey: order.customer,
    rowKey: order.orderId,
    items: JSON.stringify(order.items),
    total: order.total,
  });
}

async function getOrders() {
  const orders = [];
  const entities = tableClient.listEntities();

  for await (const entity of entities) {
    orders.push(entity);
  }

  return orders;
}
module.exports = { saveOrder, getOrders };
