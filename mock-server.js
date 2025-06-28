// mock-server.js
import WebSocket, { WebSocketServer } from "ws";

const PORT = 4000;
const wss = new WebSocketServer({ port: PORT });

console.log(`✅ Mock WebSocket server running at ws://localhost:${PORT}`);

let basePrice = 59300;
let seqNum = 1000;

wss.on("connection", (ws) => {
  console.log("📡 Client connected");

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });

  ws.on("message", (msg) => {
    console.log("📨 Client message:", msg.toString());

    try {
      const parsed = JSON.parse(msg.toString());
      if (
        parsed.op === "subscribe" &&
        parsed.args.includes("snapshotL1:BTCPFC")
      ) {
        // Send snapshot once
        sendSnapshot(ws);

        // Start interval to continuously push delta updates
        const interval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            sendDelta(ws);
          } else {
            clearInterval(interval);
          }
        }, 1000);
      }
    } catch (err) {
      console.error("❌ Error parsing message", err);
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
  for (let i = 0; i < 8; i++) {
    const priceOffset = side === "ask" ? 10 + i : -i;
    const price = (basePrice + priceOffset).toFixed(1);
    const size = (Math.random() * 0.5 + 0.1).toFixed(5);
    orders.push([price, size]);
  }
  return orders;
}

function mutateOrders(side) {
  const count = Math.floor(Math.random() * 4) + 2; // 2~5 data update
  const updates = [];
  for (let i = 0; i < count; i++) {
    const priceOffset =
      side === "ask"
        ? 10 + Math.floor(Math.random() * 8)
        : -Math.floor(Math.random() * 8);
    const price = (basePrice + priceOffset).toFixed(1);
    const size =
      Math.random() < 0.3 ? "0" : (Math.random() * 0.5 + 0.1).toFixed(5);
    updates.push([price, size]);
  }
  return updates;
}
