const { app } = require("@azure/functions");
const { saveOrder, getOrders } = require("../../table.js");

app.http("processOrder", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    let order;
    try {
      order = await request.json();
    } catch (error) {
      return {
        status: 400,
        body: JSON.stringify({ error: "Invalid JSON format" }),
      };
    }

    if (!order.orderId || !order.customer || !order.items || !order.total) {
      return {
        status: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    try {
      await saveOrder(order);
    } catch (error) {
      context.log(`Error saving order: ${error.message}`);
      return {
        status: 500,
        body: JSON.stringify({ error: "Failed to save order" }),
      };
    }

    return {
      status: 200,
      body: JSON.stringify({
        message: "Order received",
        orderId: order.orderId,
      }),
    };
  },
});

app.http("getOrders", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
      const orders = await getOrders();
      return {
        status: 200,
        body: JSON.stringify(orders),
      };
    } catch (error) {
      context.log.error(`Error retrieving orders: ${error.message}`);
      return {
        status: 500,
        body: JSON.stringify({ error: "Failed to retrieve orders" }),
      };
    }
  },
});
