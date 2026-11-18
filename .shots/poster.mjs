import { writeFileSync } from "node:fs";

const DEVTOOLS = "http://127.0.0.1:9222";
const OUT = "C:\\Users\\ZBOOK\\Desktop\\wedding-templates\\.shots";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function newTarget() {
  const res = await fetch(`${DEVTOOLS}/json/new?about:blank`, { method: "PUT" });
  if (!res.ok) throw new Error(`target failed: ${res.status}`);
  return res.json();
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let nextId = 0;
    const pending = new Map();
    const events = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const entry = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) entry.reject(new Error(JSON.stringify(msg.error)));
        else entry.resolve(msg.result);
        return;
      }
      const handlers = events.get(msg.method);
      if (handlers) for (const handler of [...handlers]) handler(msg.params);
    };

    ws.onopen = () => {
      resolve({
        send(method, params = {}) {
          const id = ++nextId;
          ws.send(JSON.stringify({ id, method, params }));
          return new Promise((res, rej) => pending.set(id, { resolve: res, reject: rej }));
        },
        once(method) {
          return new Promise((res) => {
            const handler = (params) => {
              events.set(
                method,
                (events.get(method) || []).filter((item) => item !== handler),
              );
              res(params);
            };
            events.set(method, [...(events.get(method) || []), handler]);
          });
        },
        close() {
          ws.close();
        },
      });
    };
    ws.onerror = () => reject(new Error("webSocket error"));
  });
}

const target = await newTarget();
const cdp = await connect(target.webSocketDebuggerUrl);

await cdp.send("Page.enable");
await cdp.send("Runtime.enable");
await cdp.send("Emulation.setDeviceMetricsOverride", {
  width: 600,
  height: 800,
  deviceScaleFactor: 1,
  mobile: false,
});

const loaded = cdp.once("Page.loadEventFired");
await cdp.send("Page.navigate", { url: "http://localhost:3000/poster-gilded-deco" });
await loaded;
await sleep(2000);

// hide the Next.js dev indicator so it never lands in the exported asset
await cdp.send("Runtime.evaluate", {
  expression: `(() => {
    const s = document.createElement("style");
    s.textContent = "nextjs-portal{display:none !important}";
    document.head.appendChild(s);
  })()`,
});
await sleep(300);

const data = await cdp.send("Page.captureScreenshot", {
  format: "png",
  clip: { x: 0, y: 0, width: 600, height: 800, scale: 1.5 },
});
writeFileSync(`${OUT}\\poster.png`, Buffer.from(data.data, "base64"));

cdp.close();
await fetch(`${DEVTOOLS}/json/close/${target.id}`).catch(() => {});
console.log("POSTER DONE");
