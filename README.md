# Order Book

A React-based Order Book UI challenge built for BTSE assignment.

## 🔧 Tech Stack

- [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [WebSocket API](https://btsecom.github.io/docs/futures/en/#orderbook-incremental-updates)

## 📦 Setup

```bash
# 1. Clone the repo
git clone git@github.com:eva-chu/order-book.git
cd order-book

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

## 📁 Project Structure

```
order-book/
├── public/
├── src/
│   ├── components/     # Reusable UI components (e.g., OrderBook)
│   ├── hooks/          # Custom hooks
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Root component
│   ├── main.tsx        # Entry point
│   └── index.css       # Tailwind base styles
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

## 🧪 Features

- Display top 8 buy and sell quotes
- Hover effect on rows
- Real-time WebSocket updates with animation
- Highlight for new quotes or size changes
- Accumulative quote size bar
- Last price color updates based on movement

## 🧩 WebSocket Endpoints

- Order Book: wss://ws.btse.com/ws/oss/futures (update:BTCPFC)
- Last Price: wss://ws.btse.com/ws/futures (tradeHistoryApi:BTCPFC)

## 📄 License

This project is for demo/testing purposes only.
