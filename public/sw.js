self.addEventListener("install", (event) => {
  console.log("Service worker installed");
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

importScripts('idb.js');

self.addEventListener("fetch", async (event) => {
  const req = event.request;
  if (req.method === "POST") {
    event.respondWith(
      req.clone().json().then((data) => {
        const id = crypto.randomUUID();
        const transaction = { id, ...data };
        idbKeyval.set(id, transaction);
        return new Response(JSON.stringify(transaction));
      }).catch((error) => {
        console.error(error);
      })
    );
  } else if (req.method === "GET" && req.url.endsWith('/transactions')) {
    event.respondWith(
      idbKeyval.values().then((values) => {
        return new Response(JSON.stringify(values));
      }).catch((error) => {
        console.error(error);
      })
    );
  }
});