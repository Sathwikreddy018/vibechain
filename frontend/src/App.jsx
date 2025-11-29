import { useState } from "react";

const API_BASE = "http://127.0.0.1:8000/api";

function App() {
  const [tab, setTab] = useState("user");

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>VibeChain – Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setTab("user")} style={{ marginRight: 8 }}>
          User
        </button>
        <button onClick={() => setTab("merchant")} style={{ marginRight: 8 }}>
          Merchant
        </button>
        <button onClick={() => setTab("agent")} style={{ marginRight: 8 }}>
          Agent
        </button>
        <button onClick={() => setTab("mint")} style={{ marginRight: 8 }}>
          Mint Receipt Tester
        </button>
        <button onClick={() => setTab("eternl")}>
          Eternl Connect
        </button>
      </div>

      <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
        {tab === "user" && <UserDashboard />}
        {tab === "merchant" && <MerchantDashboard />}
        {tab === "agent" && <AgentDashboard />}
        {tab === "mint" && <MintReceiptTester />}
        {tab === "eternl" && <EternlConnect />}
      </div>
    </div>
  );
}

/* ========================= USER DASHBOARD ========================= */

function UserDashboard() {
  const [address, setAddress] = useState("");
  const [reputation, setReputation] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const loadUserData = async () => {
    if (!address) return;
    setLoading(true);
    setErr("");
    try {
      const repRes = await fetch(`${API_BASE}/reputation/${address}`);
      if (!repRes.ok) throw new Error("Failed to load reputation");
      const repJson = await repRes.json();

      const recRes = await fetch(`${API_BASE}/receipts/by-user/${address}`);
      if (!recRes.ok) throw new Error("Failed to load receipts");
      const recJson = await recRes.json();

      setReputation(repJson);
      setReceipts(recJson);
    } catch (e) {
      console.error(e);
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <p>Enter a user Cardano address (payer) to view their reputation and receipts.</p>

      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="User address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>
      <button onClick={loadUserData} disabled={!address || loading}>
        {loading ? "Loading..." : "Load User Data"}
      </button>

      {err && <p style={{ color: "red" }}>{err}</p>}

      {reputation && (
        <div style={{ marginTop: 20 }}>
          <h3>Reputation</h3>
          <p>
            Address: <code>{reputation.address}</code>
          </p>
          <p>
            Score: <strong>{reputation.score}</strong>
          </p>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <h3>Receipts</h3>
        {receipts.length === 0 ? (
          <p>No receipts found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>TX Hash</th>
                <th style={thStyle}>Merchant</th>
                <th style={thStyle}>Amount (ADA)</th>
                <th style={thStyle}>NFT Asset</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((r) => (
                <tr key={r.tx_hash}>
                  <td style={tdStyle}>
                    <code>{r.tx_hash.slice(0, 18)}...</code>
                  </td>
                  <td style={tdStyle}>
                    <code>{r.merchant_address.slice(0, 12)}...</code>
                  </td>
                  <td style={tdStyle}>{r.amount_lovelace / 1_000_000}</td>
                  <td style={tdStyle}>
                    {r.nft_asset_id ? (
                      <code>{r.nft_asset_id.slice(0, 14)}...</code>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ========================= MERCHANT DASHBOARD ========================= */

function MerchantDashboard() {
  const [merchantAddress, setMerchantAddress] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [invoiceId, setInvoiceId] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDesc, setInvoiceDesc] = useState("");

  const loadMerchantData = async () => {
    if (!merchantAddress) return;
    setLoading(true);
    setErr("");
    try {
      const recRes = await fetch(
        `${API_BASE}/receipts/by-merchant/${merchantAddress}`
      );
      if (!recRes.ok) throw new Error("Failed to load receipts");
      const recJson = await recRes.json();

      const invRes = await fetch(`${API_BASE}/invoices/${merchantAddress}`);
      if (!invRes.ok) throw new Error("Failed to load invoices");
      const invJson = await invRes.json();

      setReceipts(recJson);
      setInvoices(invJson);
    } catch (e) {
      console.error(e);
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async () => {
    if (!merchantAddress || !invoiceId || !invoiceAmount) return;
    setErr("");
    try {
      const body = {
        invoice_id: invoiceId,
        merchant_address: merchantAddress,
        customer_address: customerAddress || null,
        amount_lovelace: parseInt(invoiceAmount, 10),
        description: invoiceDesc || null,
      };
      const res = await fetch(`${API_BASE}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to create invoice");
      }
      await loadMerchantData();
      setInvoiceId("");
      setCustomerAddress("");
      setInvoiceAmount("");
      setInvoiceDesc("");
    } catch (e) {
      console.error(e);
      setErr(e.message || "Error");
    }
  };

  const markPaid = async (invoiceId) => {
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/invoices/${invoiceId}/mark-paid`, {
        method: "POST",
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to mark invoice paid");
      }
      await loadMerchantData();
    } catch (e) {
      console.error(e);
      setErr(e.message || "Error");
    }
  };

  return (
    <div>
      <h2>Merchant Dashboard</h2>
      <p>Enter a merchant address to see receipts and manage invoices.</p>

      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Merchant address..."
          value={merchantAddress}
          onChange={(e) => setMerchantAddress(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>
      <button onClick={loadMerchantData} disabled={!merchantAddress || loading}>
        {loading ? "Loading..." : "Load Merchant Data"}
      </button>

      {err && <p style={{ color: "red" }}>{err}</p>}

      <div style={{ marginTop: 20 }}>
        <h3>Receipts for this Merchant</h3>
        {receipts.length === 0 ? (
          <p>No receipts found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>TX Hash</th>
                <th style={thStyle}>Payer</th>
                <th style={thStyle}>Amount (ADA)</th>
                <th style={thStyle}>NFT Asset</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((r) => (
                <tr key={r.tx_hash}>
                  <td style={tdStyle}>
                    <code>{r.tx_hash.slice(0, 18)}...</code>
                  </td>
                  <td style={tdStyle}>
                    <code>{r.payer_address.slice(0, 12)}...</code>
                  </td>
                  <td style={tdStyle}>{r.amount_lovelace / 1_000_000}</td>
                  <td style={tdStyle}>
                    {r.nft_asset_id ? (
                      <code>{r.nft_asset_id.slice(0, 14)}...</code>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <h3>Create Invoice</h3>
        <div style={{ display: "grid", gap: 8 }}>
          <input
            type="text"
            placeholder="Invoice ID"
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
            style={{ padding: 8 }}
          />
          <input
            type="text"
            placeholder="Customer address (optional)"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            style={{ padding: 8 }}
          />
          <input
            type="number"
            placeholder="Amount (in lovelace)"
            value={invoiceAmount}
            onChange={(e) => setInvoiceAmount(e.target.value)}
            style={{ padding: 8 }}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={invoiceDesc}
            onChange={(e) => setInvoiceDesc(e.target.value)}
            style={{ padding: 8 }}
          />
        </div>
        <button
          style={{ marginTop: 10 }}
          onClick={createInvoice}
          disabled={!merchantAddress || !invoiceId || !invoiceAmount}
        >
          Create Invoice
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h3>Invoices</h3>
        {invoices.length === 0 ? (
          <p>No invoices found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Invoice ID</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Amount (ADA)</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>NFT Asset</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.invoice_id}>
                  <td style={tdStyle}>
                    <code>{inv.invoice_id}</code>
                  </td>
                  <td style={tdStyle}>
                    {inv.customer_address ? (
                      <code>{inv.customer_address.slice(0, 12)}...</code>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td style={tdStyle}>{inv.amount_lovelace / 1_000_000}</td>
                  <td style={tdStyle}>{inv.status}</td>
                  <td style={tdStyle}>
                    {inv.nft_asset_id ? (
                      <code>{inv.nft_asset_id.slice(0, 14)}...</code>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td style={tdStyle}>
                    {inv.status !== "paid" && (
                      <button onClick={() => markPaid(inv.invoice_id)}>
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ========================= AGENT DASHBOARD ========================= */

function AgentDashboard() {
  const [createdAgent, setCreatedAgent] = useState(null);
  const [name, setName] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [repAddress, setRepAddress] = useState("");
  const [err, setErr] = useState("");

  const [agentIdPay, setAgentIdPay] = useState("");
  const [agentKeyPay, setAgentKeyPay] = useState("");
  const [merchantPay, setMerchantPay] = useState("");
  const [amountPay, setAmountPay] = useState("");
  const [lastPayResult, setLastPayResult] = useState(null);

  const createAgent = async () => {
    setErr("");
    try {
      const body = {
        name,
        owner_address: ownerAddress || null,
        reputation_address: repAddress || null,
      };
      const res = await fetch(`${API_BASE}/agents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to create agent");
      }
      const json = await res.json();
      setCreatedAgent(json);
      setName("");
      setOwnerAddress("");
      setRepAddress("");
    } catch (e) {
      console.error(e);
      setErr(e.message || "Error");
    }
  };

  const agentPay = async () => {
    if (!agentIdPay || !agentKeyPay || !merchantPay || !amountPay) return;
    setErr("");
    try {
      const body = {
        merchant_address: merchantPay,
        amount_lovelace: parseInt(amountPay, 10),
      };
      const res = await fetch(`${API_BASE}/agents/${agentIdPay}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": agentKeyPay,
        },
        body: JSON.stringify(body),
      });
      const txt = await res.text();
      if (!res.ok) {
        throw new Error(txt || "Agent payment failed");
      }
      const json = JSON.parse(txt);
      setLastPayResult(json);
    } catch (e) {
      console.error(e);
      setErr(e.message || "Error");
    }
  };

  const loadAgentPayments = async (id) => {
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/agents/${id}/payments`);
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to load agent payments");
      }
      const json = await res.json();
      alert("Payments JSON:\n" + JSON.stringify(json, null, 2));
    } catch (e) {
      console.error(e);
      setErr(e.message || "Error");
    }
  };

  return (
    <div>
      <h2>Agent Dashboard</h2>
      <p>Create AI agents and simulate payments via API keys.</p>

      {err && <p style={{ color: "red" }}>{err}</p>}

      <div style={{ marginBottom: 24 }}>
        <h3>Create Agent</h3>
        <div style={{ display: "grid", gap: 8 }}>
          <input
            type="text"
            placeholder="Agent name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: 8 }}
          />
          <input
            type="text"
            placeholder="Owner address (optional)"
            value={ownerAddress}
            onChange={(e) => setOwnerAddress(e.target.value)}
            style={{ padding: 8 }}
          />
          <input
            type="text"
            placeholder="Reputation address (optional)"
            value={repAddress}
            onChange={(e) => setRepAddress(e.target.value)}
            style={{ padding: 8 }}
          />
        </div>
        <button
          style={{ marginTop: 10 }}
          onClick={createAgent}
          disabled={!name}
        >
          Create Agent
        </button>

        {createdAgent && (
          <div style={{ marginTop: 12 }}>
            <h4>New Agent Created</h4>
            <p>ID: {createdAgent.id}</p>
            <p>Name: {createdAgent.name}</p>
            <p>
              API Key: <code>{createdAgent.api_key}</code>
            </p>
            <button onClick={() => loadAgentPayments(createdAgent.id)}>
              Show Payments for Agent {createdAgent.id}
            </button>
          </div>
        )}
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3>Agent Pay (simulate)</h3>
        <div style={{ display: "grid", gap: 8 }}>
          <input
            type="number"
            placeholder="Agent ID"
            value={agentIdPay}
            onChange={(e) => setAgentIdPay(e.target.value)}
            style={{ padding: 8 }}
          />
          <input
            type="text"
            placeholder="Agent API Key"
            value={agentKeyPay}
            onChange={(e) => setAgentKeyPay(e.target.value)}
            style={{ padding: 8 }}
          />
          <input
            type="text"
            placeholder="Merchant address"
            value={merchantPay}
            onChange={(e) => setMerchantPay(e.target.value)}
            style={{ padding: 8 }}
          />
          <input
            type="number"
            placeholder="Amount (lovelace)"
            value={amountPay}
            onChange={(e) => setAmountPay(e.target.value)}
            style={{ padding: 8 }}
          />
        </div>
        <button style={{ marginTop: 10 }} onClick={agentPay}>
          Agent Pay
        </button>

        {lastPayResult && (
          <div style={{ marginTop: 12 }}>
            <h4>Last Payment Result</h4>
            <pre style={{ background: "#f7f7f7", padding: 8 }}>
              {JSON.stringify(lastPayResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================= MINT RECEIPT TESTER ========================= */

function MintReceiptTester() {
  const [txHash, setTxHash] = useState("");
  const [payerAddress, setPayerAddress] = useState("");
  const [merchantAddress, setMerchantAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const mintReceipt = async () => {
    if (!txHash || !payerAddress || !merchantAddress || !amount) return;
    setErr("");
    setResult(null);
    setLoading(true);
    try {
      const body = {
        tx_hash: txHash,
        payer_address: payerAddress,
        merchant_address: merchantAddress,
        amount_lovelace: parseInt(amount, 10),
      };
      const res = await fetch(`${API_BASE}/mint-receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const txt = await res.text();
      if (!res.ok) {
        throw new Error(txt || "Mint receipt failed");
      }
      const json = JSON.parse(txt);
      setResult(json);
    } catch (e) {
      console.error(e);
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Mint Receipt Tester</h2>
      <p>
        Send ADA using Eternl, copy the transaction hash, and paste it here to
        mint a VibeChain receipt via the backend.
      </p>

      {err && <p style={{ color: "red" }}>{err}</p>}

      <div style={{ display: "grid", gap: 8 }}>
        <input
          type="text"
          placeholder="TX Hash"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          style={{ padding: 8 }}
        />
        <input
          type="text"
          placeholder="Payer address"
          value={payerAddress}
          onChange={(e) => setPayerAddress(e.target.value)}
          style={{ padding: 8 }}
        />
        <input
          type="text"
          placeholder="Merchant address"
          value={merchantAddress}
          onChange={(e) => setMerchantAddress(e.target.value)}
          style={{ padding: 8 }}
        />
        <input
          type="number"
          placeholder="Amount (lovelace)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: 8 }}
        />
      </div>
      <button style={{ marginTop: 10 }} onClick={mintReceipt} disabled={loading}>
        {loading ? "Minting..." : "Mint Receipt"}
      </button>

      {result && (
        <div style={{ marginTop: 12 }}>
          <h4>Result</h4>
          <pre style={{ background: "#f7f7f7", padding: 8 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

/* ========================= ETERNL CONNECT (CIP-30) ========================= */

function EternlConnect() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [api, setApi] = useState(null);

  const connectWallet = async () => {
    try {
      setError("");
      if (!window.cardano || !window.cardano.eternl) {
        setError("Eternl wallet not found in browser.");
        return;
      }
      const walletApi = await window.cardano.eternl.enable();
      setApi(walletApi);
      const used = await walletApi.getUsedAddresses();
      if (used && used.length > 0) {
        // CIP-30 returns hex; we can still use it as an identifier in backend/reputation
        setAddress(used[0]);
      }
      setConnected(true);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to connect Eternl");
    }
  };

  return (
    <div>
      <h2>Eternl Wallet Connection</h2>
      <p>
        This uses the CIP-30 API (<code>window.cardano.eternl</code>) to
        connect the wallet and read an address. For now, you still send ADA
        manually and paste the tx hash into the Mint Receipt tab.
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!connected ? (
        <button onClick={connectWallet}>Connect Eternl</button>
      ) : (
        <p style={{ color: "green" }}>Connected to Eternl.</p>
      )}

      {address && (
        <div style={{ marginTop: 12 }}>
          <h4>Wallet Address (hex from CIP-30)</h4>
          <code>{address}</code>
          <p style={{ marginTop: 8, fontSize: 13 }}>
            You can paste this value as <strong>payer_address</strong> in the
            Mint Receipt tab. The reputation engine will use it as your identity.
          </p>
        </div>
      )}
    </div>
  );
}

/* ========================= TABLE STYLES ========================= */

const thStyle = {
  borderBottom: "1px solid #ccc",
  textAlign: "left",
  padding: "6px 4px",
  fontSize: 13,
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "6px 4px",
  fontSize: 13,
};

export default App;
