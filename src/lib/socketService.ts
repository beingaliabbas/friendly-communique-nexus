
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [clientReady, setClientReady] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    // Connect to the socket if not already connected
    if (!socket) {
      // Determine if we're in development or production
      const host = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';
      socket = io(host);
    }

    // Set up event listeners
    const onConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    };

    const onQrCode = (qrImage: string) => {
      console.log('QR code received');
      setQrCode(qrImage);
      setClientReady(false);
    };

    const onStatus = (status: { ready: boolean; apiKey?: string }) => {
      console.log('Status update:', status);
      setClientReady(status.ready);
      if (status.ready) {
        setQrCode(null);
      }
      if (status.apiKey) {
        setApiKey(status.apiKey);
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('qr', onQrCode);
    socket.on('status', onStatus);

    // Clean up event listeners on unmount
    return () => {
      socket?.off('connect', onConnect);
      socket?.off('disconnect', onDisconnect);
      socket?.off('qr', onQrCode);
      socket?.off('status', onStatus);
    };
  }, []);

  return { isConnected, clientReady, qrCode, apiKey };
};

export const sendMessage = async (apiKey: string, phoneNumber: string, message: string) => {
  try {
    const response = await fetch('/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey, phoneNumber, message }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      message: 'Failed to send the message. Network error.',
    };
  }
};

export const logout = async () => {
  try {
    const response = await fetch('/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error during logout:', error);
    return {
      success: false,
      message: 'Failed to logout. Network error.',
    };
  }
};
