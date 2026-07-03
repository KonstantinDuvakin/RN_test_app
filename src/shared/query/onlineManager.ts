import { onlineManager } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo'
// Связываем встроенный onlineManager RQ с реальным статусом сети.
// Теперь RQ знает, когда офлайн → паузит мутации; когда онлайн → возобновляет.

export function initOnlineManager() {
  return onlineManager.setEventListener(setOnline => {
    return NetInfo.addEventListener(state => {
      setOnline(!!state.isConnected);
    });
  });
}
