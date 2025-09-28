import Echo from 'laravel-echo';

export const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  wsHost: import.meta.env.VITE_PUSHER_HOST,
  wsPort: Number(import.meta.env.VITE_PUSHER_PORT),
  forceTLS: false,
  disableStats: true,
});
