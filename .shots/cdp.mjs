import { writeFileSync } from "node:fs";

const DEVTOOLS = "http://127.0.0.1:9222";
const OUT = "C:\\Users\\ZBOOK\\Desktop\\wedding-templates\\.shots";
const URL = process.argv[2] || "http://localhost:3000/templates/gilded-deco";
const TILES = [0, 700, 1400, 2100, 2800, 3500, 4200];

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
  width: 430,
  height: 932,
  deviceScaleFactor: 1,
  mobile: true,
});

const evaluate = async (expression) => {
  const res = await cdp.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (res.exceptionDetails) throw new Error(JSON.stringify(res.exceptionDetails));
  return res.result.value;
};

const loaded = cdp.once("Page.loadEventFired");
await cdp.send("Page.navigate", { url: URL });
await loaded;
await sleep(2500);
await evaluate("document.documentElement.style.scrollBehavior = 'auto';");
await evaluate(`(() => {
  const s = document.createElement("style");
  s.textContent = "nextjs-portal{display:none !important}";
  document.head.appendChild(s);
})()`);

const metrics = await evaluate(`(() => {
  const doc = document.documentElement;
  const rect = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; };
  const wide = [...document.querySelectorAll("body *")]
    .map((el) => ({ tag: el.tagName, cls: String(el.className).slice(0, 70), r: el.getBoundingClientRect() }))
    .filter((o) => o.r.width > 0 && (o.r.right > doc.clientWidth + 0.5 || o.r.left < -0.5))
    .slice(0, 10)
    .map((o) => ({ tag: o.tag, cls: o.cls, left: Math.round(o.r.left), right: Math.round(o.r.right), w: Math.round(o.r.width) }));
  const header = document.querySelector("header");
  return {
    innerWidth: window.innerWidth,
    clientWidth: doc.clientWidth,
    scrollWidth: doc.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    scrollHeight: doc.scrollHeight,
    scrollX: window.scrollX,
    header: rect(header),
    headerKids: header ? [...header.firstElementChild.children].map(rect) : [],
    hero: rect(document.querySelector("main > section")),
    nav: rect(document.querySelector("nav")),
    wideElements: wide
  };
})()`);

console.log("METRICS " + JSON.stringify(metrics, null, 2));

for (const y of TILES) {
  await evaluate(`window.scrollTo(0, ${y});`);
  await sleep(450);
  const data = await cdp.send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`${OUT}\\tile-${y}.png`, Buffer.from(data.data, "base64"));
}

const scrollHeight = metrics.scrollHeight;
await evaluate(`window.scrollTo(0, ${Math.max(0, scrollHeight - 932)});`);
await sleep(450);
const tail = await cdp.send("Page.captureScreenshot", { format: "png" });
writeFileSync(`${OUT}\\tile-tail.png`, Buffer.from(tail.data, "base64"));

const clicked = await evaluate(`(() => {
  const target = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("مهر طلایی"));
  if (!target) return false;
  target.click();
  return true;
})()`);
console.log("STAMP CLICKED " + clicked);
await sleep(900);
await evaluate(`document.querySelector("#rsvp")?.scrollIntoView({ block: "center" });`);
await sleep(500);
const stamp = await cdp.send("Page.captureScreenshot", { format: "png" });
writeFileSync(`${OUT}\\stamp.png`, Buffer.from(stamp.data, "base64"));

cdp.close();
await fetch(`${DEVTOOLS}/json/close/${target.id}`).catch(() => {});
console.log("DONE");
