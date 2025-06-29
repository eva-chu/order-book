import WebSocket, { WebSocketServer } from "ws";

const PORT = 4000;
const wss = new WebSocketServer({ port: PORT });
console.log(`✅ Mock WebSocket server running at ws://localhost:${PORT}`);

let basePrice = 59300;
let seqNum = 1000;

const clientIntervals = new WeakMap();

wss.on("connection", (ws) => {
  const intervals = [];
  clientIntervals.set(ws, intervals);
  console.log("Client connected");

  ws.on("close", () => {
    console.log("Client disconnected");
    clientIntervals.get(ws)?.forEach(clearInterval);
  });

  ws.on("message", (msg) => {
    const text = msg.toString();
    console.log("Client message:", text);

    try {
      const parsed = JSON.parse(text);

      // Safely check for subscription
      if (
        parsed &&
        parsed.op === "subscribe" &&
        Array.isArray(parsed.args) &&
        parsed.args.includes("update:BTCPFC")
      ) {
        // Delay snapshot to ensure client is ready
        setTimeout(() => {
          sendSnapshot(ws);
        }, 100);

        // Start interval for delta updates
        const interval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            sendDelta(ws);
          } else {
            clearInterval(interval);
          }
        }, 1000);
        intervals.push(interval);
      } else if (
        parsed.op === "subscribe" &&
        parsed.args.includes("tradeHistoryApi:BTCPFC")
      ) {
        // Start interval for pushing last trade price
        const priceInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            sendLastPrice(ws);
          } else {
            clearInterval(priceInterval);
          }
        }, 1500);
        intervals.push(priceInterval);
      }
    } catch (err) {
      console.error("Error parsing message", err);
    }
  });
});

function sendSnapshot(ws) {
  const snapshot = {
    topic: "update:BTCPFC",
    data: {
      type: "snapshot",
      asks: generateOrders("ask"),
      bids: generateOrders("bid"),
      seqNum: seqNum,
      prevSeqNum: seqNum - 1,
      timestamp: Date.now(),
      symbol: "BTCPFC",
    },
  };
  seqNum++;
  ws.send(JSON.stringify(snapshot));
}

function sendDelta(ws) {
  const delta = {
    topic: "update:BTCPFC",
    data: {
      type: "delta",
      asks: mutateOrders("ask"),
      bids: mutateOrders("bid"),
      seqNum: seqNum,
      prevSeqNum: seqNum - 1,
      timestamp: Date.now(),
      symbol: "BTCPFC",
    },
  };
  seqNum++;
  ws.send(JSON.stringify(delta));
}

function generateOrders(side) {
  const orders = [];
  for (let i = 0; i < 20; i++) {
    const priceOffset = side === "ask" ? 10 + i : -i;
    const price = (basePrice + priceOffset).toFixed(1);

    const size = Math.floor(Math.random() * 200000 + 50000).toString(); // 50,000 ~ 250,000
    orders.push([price, size]);
  }
  return orders;
}

function mutateOrders(side) {
  const updates = [];
  const count = Math.floor(Math.random() * 4) + 2; // 2~5 updates

  for (let i = 0; i < count; i++) {
    const priceOffset =
      side === "ask"
        ? 10 + Math.floor(Math.random() * 8)
        : -Math.floor(Math.random() * 8);
    const price = (basePrice + priceOffset).toFixed(1);

    const size =
      Math.random() < 0.3
        ? "0"
        : Math.floor(Math.random() * 200000 + 50000).toString();

    updates.push([price, size]);
  }
  return updates;
}

function sendLastPrice(ws) {
  const newPrice = +(basePrice + (Math.random() - 0.5) * 10).toFixed(1);
  basePrice = newPrice;

  const trade = {
    topic: "tradeHistoryApi:BTCPFC",
    data: [
      {
        symbol: "BTCPFC",
        side: Math.random() > 0.5 ? "BUY" : "SELL",
        size: +(Math.random() * 0.01 + 0.001).toFixed(5),
        price: newPrice,
        tradeId: Math.floor(Math.random() * 1e8),
        timestamp: Date.now(),
      },
    ],
  };
  ws.send(JSON.stringify(trade));
}
