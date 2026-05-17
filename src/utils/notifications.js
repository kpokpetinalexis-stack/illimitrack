const NOTIFIED_KEY = 'illimite_notified';

export const requestPermission = async () => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
};

export const getClientStatus = (expirationDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const exp = new Date(expirationDate);
  exp.setHours(0, 0, 0, 0);

  if (exp < today) return 'expired';
  if (exp.getTime() === today.getTime()) return 'expires_today';
  if (exp.getTime() === tomorrow.getTime()) return 'expires_tomorrow';
  return 'active';
};

export const checkAndNotify = (clients) => {
  if (Notification.permission !== 'granted') return;

  const todayKey = new Date().toISOString().split('T')[0];
  const notified = JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '{}');

  clients.forEach(client => {
    const status = getClientStatus(client.expirationDate);
    const key = `${client.id}_${todayKey}`;

    if ((status === 'expires_tomorrow' || status === 'expires_today') && !notified[key]) {
      const msg = status === 'expires_today'
        ? `⚠️ Illimité de ${client.name} EXPIRE AUJOURD'HUI !`
        : `⏰ Illimité de ${client.name} expire DEMAIN`;

      new Notification(msg, {
        body: `${client.phone} · ${client.operator.toUpperCase()}`,
        tag: key,
      });

      notified[key] = true;
    }
  });

  localStorage.setItem(NOTIFIED_KEY, JSON.stringify(notified));
};

export const getExpiringClients = (clients) => {
  return clients.filter(c => {
    const s = getClientStatus(c.expirationDate);
    return s === 'expires_tomorrow' || s === 'expires_today';
  });
};

export const getNotRenewedClients = (clients) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return clients.filter(c => {
    const exp = new Date(c.expirationDate);
    exp.setHours(0, 0, 0, 0);
    const daysSince = Math.round((today - exp) / (1000 * 60 * 60 * 24));
    return daysSince >= 3;
  });
};

export const checkAndNotifyNotRenewed = (clients) => {
  if (Notification.permission !== 'granted') return;

  const todayKey = new Date().toISOString().split('T')[0];
  const notified = JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '{}');

  getNotRenewedClients(clients).forEach(client => {
    const key = `norenew_${client.id}_${todayKey}`;
    if (!notified[key]) {
      const exp = new Date(client.expirationDate);
      exp.setHours(0, 0, 0, 0);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const days = Math.round((today - exp) / (1000 * 60 * 60 * 24));
      new Notification(`🔴 ${client.name} n'a pas encore renouvelé`, {
        body: `Expiré depuis ${days} jour${days > 1 ? 's' : ''} · ${client.phone} · ${client.operator.toUpperCase()}`,
        tag: key,
      });
      notified[key] = true;
    }
  });

  localStorage.setItem(NOTIFIED_KEY, JSON.stringify(notified));
};
