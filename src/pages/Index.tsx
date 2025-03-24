
import React, { useState, useEffect } from 'react';
import { useSocket } from '@/lib/socketService';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import ConnectionStatus from '@/components/ConnectionStatus';
import ApiKeyDisplay from '@/components/ApiKeyDisplay';
import MessageForm from '@/components/MessageForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { Moon, Sun } from 'lucide-react';

const Index = () => {
  const { isConnected, clientReady, qrCode, apiKey } = useSocket();
  const [activeTab, setActiveTab] = useState<string>(clientReady ? "send" : "connect");
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // When client becomes ready, switch to the send tab
  useEffect(() => {
    if (clientReady) {
      setActiveTab("send");
    }
  }, [clientReady]);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-800 flex flex-col">
      <header className="border-b border-gray-700 bg-gray-800 dark:bg-gray-900">
        <div className="container py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-indigo-400 dark:text-indigo-300">WhatsApp Automation Suite</h1>
            <p className="text-gray-400 mt-1 dark:text-gray-300">Professional WhatsApp Automation Solution</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="text-gray-400 hover:text-white transition-colors"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? clientReady ? 'bg-green-500' : 'bg-yellow-500' : 'bg-gray-600'}`}></div>
              <span className="text-gray-300 dark:text-gray-200">
                {isConnected ? (clientReady ? 'Connected' : 'Waiting for QR scan') : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <ConnectionStatus isConnected={isConnected} clientReady={clientReady} />
        
        {apiKey && <ApiKeyDisplay apiKey={apiKey} />}
        
        {!isConnected && (
          <Card className="mb-6 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-white">Connecting to server...</CardTitle>
              <CardDescription className="text-center text-gray-300">Please wait while we establish connection</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={45} className="w-full bg-gray-700" />
            </CardContent>
          </Card>
        )}
        
        {isConnected && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              {!clientReady && (
                <QRCodeDisplay qrCode={qrCode} isLoading={isConnected && !qrCode && !clientReady} />
              )}
            </div>
            
            <div className="lg:col-span-2">
              {clientReady ? (
                <MessageForm apiKey={apiKey} clientReady={clientReady} />
              ) : (
                <Card className="h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl">
                  <CardContent className="text-center p-6">
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Scan the QR Code</h3>
                    <p className="text-gray-400">
                      Please scan the QR code with your WhatsApp to start sending messages
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        <div className="container">
          <p>WhatsApp API Interface &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
