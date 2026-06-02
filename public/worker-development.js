/******/ (() => { // webpackBootstrap
// worker/index.ts

self.addEventListener("notificationclick", event => {
  var _event$notification;
  event.notification.close();
  const url = (_event$notification = event.notification) === null || _event$notification === void 0 || (_event$notification = _event$notification.data) === null || _event$notification === void 0 ? void 0 : _event$notification.url;
  if (url) {
    event.waitUntil(self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(clientList => {
      // Try to focus existing window if possible, otherwise open new
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    }));
  }
});
/******/ })()
;