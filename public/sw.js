self.addEventListener("install", event => {
    console.log("Service worker installed");
  });
  
  self.addEventListener("activate", event => {
    console.log("Service worker activated");
  });
  
  importScripts('idb.js');
  
  self.addEventListener("fetch", async event => {
    const req = event.request;
    if (req.method === "POST") {
      event.respondWith(new Promise((resolve, reject) => {
        req.clone().json()
          .then(data => {
            const id = crypto.randomUUID();
            const transaction = { id, ...data };
            idbKeyval.set(id, transaction);
            resolve(new Response(JSON.stringify(transaction)));
          })
          .catch(error => reject(error));
      }));
    } else if (req.method === "GET" && req.url.endsWith('/transactions')) {
      event.respondWith(new Promise((resolve, reject) => {
        idbKeyval.values()
          .then(values => resolve(new Response(JSON.stringify(values))))
          .catch(error => reject(error));
      }));
    }
  });  