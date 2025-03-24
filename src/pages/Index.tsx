
import React, { useState } from 'react';
import { useSocket } from '@/lib/socketService';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import ConnectionStatus from '@/components/ConnectionStatus';
import ApiKeyDisplay from '@/components/ApiKeyDisplay';
import MessageForm from '@/components/MessageForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';

const Index = () => {
  const { isConnected, clientReady, qrCode, apiKey } = useSocket();
  const [activeTab, setActiveTab] = useState<string>(clientReady ? "send" : "connect");

  // When client becomes ready, switch to the send tab
  React.useEffect(() => {
    if (clientReady) {
      setActiveTab("send");
    }
  }, [clientReady]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">WhatsApp API</h1>
          <div className="text-sm text-muted-foreground">
            {isConnected ? 
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Connected
              </span> : 
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span> Disconnected
              </span>
            }
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <ConnectionStatus isConnected={isConnected} clientReady={clientReady} />
        
        {apiKey && <ApiKeyDisplay apiKey={apiKey} />}
        
        {!isConnected && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">Connecting to server...</CardTitle>
              <CardDescription className="text-center">Please wait while we establish connection</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={45} className="w-full" />
            </CardContent>
          </Card>
        )}
        
        {isConnected && (
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="connect">Connect</TabsTrigger>
              <TabsTrigger value="send" disabled={!clientReady}>Send Messages</TabsTrigger>
            </TabsList>
            
            <TabsContent value="connect" className="mt-6">
              <QRCodeDisplay qrCode={qrCode} isLoading={isConnected && !qrCode && !clientReady} />
              {clientReady && (
                <div className="text-center mt-4">
                  <p className="text-green-600 font-medium">WhatsApp connected successfully!</p>
                  <button 
                    onClick={() => setActiveTab("send")} 
                    className="mt-2 text-primary underline"
                  >
                    Go to message sending
                  </button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="send" className="mt-6">
              <div className="max-w-2xl mx-auto">
                <MessageForm apiKey={apiKey} clientReady={clientReady} />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>

      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>WhatsApp API Interface &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
