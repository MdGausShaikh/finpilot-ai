import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts";

const marketAssets = [
  {
    id: 1,
    name: "Nifty 50",
    category: "Index",
    price: "24,850",
    change: "+0.82%",
    sentiment: "Bullish",
    risk: "Medium",
    action: "Hold / SIP"
  },
  {
    id: 2,
    name: "Sensex",
    category: "Index",
    price: "81,720",
    change: "+0.64%",
    sentiment: "Bullish",
    risk: "Medium",
    action: "Hold"
  },
  {
    id: 3,
    name: "Gold",
    category: "Commodity",
    price: "₹72,400",
    change: "+1.12%",
    sentiment: "Positive",
    risk: "Low",
    action: "Accumulate"
  },
  {
    id: 4,
    name: "Silver",
    category: "Commodity",
    price: "₹91,200",
    change: "-0.35%",
    sentiment: "Neutral",
    risk: "Medium",
    action: "Watch"
  },
  {
    id: 5,
    name: "Bitcoin",
    category: "Crypto",
    price: "₹58,40,000",
    change: "+2.45%",
    sentiment: "Volatile",
    risk: "High",
    action: "Avoid Heavy Buy"
  }
];

const trendData = [
  { month: "Jan", market: 100 },
  { month: "Feb", market: 108 },
  { month: "Mar", market: 103 },
  { month: "Apr", market: 114 },
  { month: "May", market: 122 },
  { month: "Jun", market: 128 }
];

const opportunityData = [
  { name: "Index SIP", score: 86 },
  { name: "Gold", score: 78 },
  { name: "Debt Fund", score: 72 },
  { name: "Large Cap", score: 69 },
  { name: "Crypto", score: 38 }
];

const newsItems = [
  {
    title: "Indian equity markets remain steady with strong SIP inflows",
    sentiment: "Positive",
    impact: "Good for long-term index investing"
  },
  {
    title: "Gold continues to attract defensive investors",
    sentiment: "Positive",
    impact: "Useful for portfolio diversification"
  },
  {
    title: "Crypto market remains highly volatile",
    sentiment: "High Risk",
    impact: "Avoid large exposure without strong risk appetite"
  }
];

function MarketInsights() {
  const [selectedAsset, setSelectedAsset] = useState(marketAssets[0]);

  const bullishCount = useMemo(
    () =>
      marketAssets.filter(
        (item) =>
          item.sentiment === "Bullish" || item.sentiment === "Positive"
      ).length,
    []
  );

  return (
    <div className="module-page">
      <div className="module-hero">
        <div>
          <span className="eyebrow">AI Market Intelligence</span>
          <h1>Market Intelligence Hub</h1>
          <p>
            Track market updates, investment opportunities, risk levels and
            AI-based investment direction.
          </p>
        </div>

        <div className="hero-pill">Live API Ready</div>
      </div>

      <section className="summary-grid four">
        <div className="summary-card">
          <p>Market Mood</p>
          <h2>Bullish</h2>
          <span className="up">Positive near-term signal</span>
        </div>

        <div className="summary-card">
          <p>Positive Assets</p>
          <h2>{bullishCount}</h2>
          <span className="up">Good opportunity zones</span>
        </div>

        <div className="summary-card">
          <p>Risk Alert</p>
          <h2>Crypto</h2>
          <span className="down">High volatility</span>
        </div>

        <div className="summary-card">
          <p>Best AI Pick</p>
          <h2>Index SIP</h2>
          <span className="up">Long-term wealth option</span>
        </div>
      </section>

      <section className="module-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Market Trend</h3>
              <p className="muted">Sample market movement index.</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData}>
              <Area
                type="monotone"
                dataKey="market"
                stroke="#7c3aed"
                fill="#7c3aed33"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3>Opportunity Score</h3>
              <p className="muted">AI-style opportunity ranking.</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={opportunityData}>
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Bar dataKey="score" fill="#7c3aed" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card table-card">
        <div className="table-toolbar">
          <div>
            <h3>Market Watchlist</h3>
            <p className="muted">
              Sample market data. Later we will connect Finnhub/market APIs.
            </p>
          </div>
        </div>

        <table className="premium-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Category</th>
              <th>Price</th>
              <th>Change</th>
              <th>Sentiment</th>
              <th>Risk</th>
              <th>AI Action</th>
            </tr>
          </thead>

          <tbody>
            {marketAssets.map((asset) => (
              <tr
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className="clickable-row"
              >
                <td>{asset.name}</td>
                <td>
                  <span className="tag">{asset.category}</span>
                </td>
                <td>{asset.price}</td>
                <td className={asset.change.startsWith("+") ? "up" : "down"}>
                  {asset.change}
                </td>
                <td>{asset.sentiment}</td>
                <td>{asset.risk}</td>
                <td>{asset.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="module-grid">
        <div className="card ai-insight-card">
          <span className="eyebrow">AI Investment View</span>
          <h3>{selectedAsset.name}</h3>

          <p>
            Current AI view for {selectedAsset.name}: sentiment is{" "}
            <b>{selectedAsset.sentiment}</b>, risk level is{" "}
            <b>{selectedAsset.risk}</b>, and suggested action is{" "}
            <b>{selectedAsset.action}</b>.
          </p>

          <div className="insight-box">
            <p>AI Action</p>
            <h2>{selectedAsset.action}</h2>
          </div>
        </div>

        <div className="card table-card">
          <div className="card-header">
            <div>
              <h3>Finance News Summary</h3>
              <p className="muted">AI-ready market news analysis.</p>
            </div>
          </div>

          <table className="premium-table">
            <thead>
              <tr>
                <th>News</th>
                <th>Sentiment</th>
                <th>Impact</th>
              </tr>
            </thead>

            <tbody>
              {newsItems.map((item) => (
                <tr key={item.title}>
                  <td>{item.title}</td>
                  <td>
                    <span className="tag">{item.sentiment}</span>
                  </td>
                  <td>{item.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card ai-insight-card">
        <span className="eyebrow">Important Note</span>
        <h3>Investment Disclaimer</h3>
        <p>
          This module provides educational AI-style insights only. Final
          investment decisions should be taken after your own research or with a
          certified financial advisor.
        </p>
      </section>
    </div>
  );
}

export default MarketInsights;