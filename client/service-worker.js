//Register event listener for the 'push' event.
self.addEventListener('push', function(event) {
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    // Show a notification with title 'ServiceWorker Cookbook' and body 'Alea iacta est'.
    fetch('https://api.chucknorris.io/jokes/random')
    .then(res => res.json())
    .then(data => {
      return self.registration
        .showNotification(
          'More about Chuck Norris',
          {
            body: data.value,
            icon: data.icon_url
          }
        )
    })
    .catch(err => {
      console.error(err);
    })
  );
});
