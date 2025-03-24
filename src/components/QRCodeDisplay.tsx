
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScanLine } from "lucide-react";

interface QRCodeDisplayProps {
  qrCode: string | null;
  isLoading: boolean;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrCode, isLoading }) => {
  if (!qrCode && !isLoading) {
    return null;
  }

  return (
    <Card className="w-full md:max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Connect to WhatsApp</CardTitle>
        <CardDescription className="text-center">
          Scan this QR code with your phone to connect
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6">
        {isLoading ? (
          <div className="w-64 h-64 flex items-center justify-center bg-secondary animate-pulse rounded-md">
            <ScanLine className="w-12 h-12 text-muted-foreground" />
          </div>
        ) : qrCode ? (
          <div className="p-4 bg-white rounded-md">
            <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64" />
          </div>
        ) : null}
        <Tabs defaultValue="steps" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="steps">Steps</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>
          <TabsContent value="steps" className="space-y-4 mt-2">
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
              <li>Open WhatsApp on your phone</li>
              <li>Tap Menu or Settings and select WhatsApp Web</li>
              <li>Point your phone to this screen to capture the QR code</li>
            </ol>
          </TabsContent>
          <TabsContent value="help" className="mt-2">
            <p className="text-sm text-muted-foreground">
              Having trouble connecting? Make sure your phone has an active internet connection and try refreshing this page.
            </p>
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;
