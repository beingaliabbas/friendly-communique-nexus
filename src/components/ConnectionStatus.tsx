
import React from 'react';
import { AlertCircle, Check, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { logout } from '@/lib/socketService';
import { useToast } from '@/hooks/use-toast';

interface ConnectionStatusProps {
  isConnected: boolean;
  clientReady: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected, clientReady }) => {
  const { toast } = useToast();

  const handleLogout = async () => {
    const response = await logout();
    toast({
      title: response.success ? 'Logged out successfully' : 'Failed to logout',
      description: response.message,
      variant: response.success ? 'default' : 'destructive',
    });
  };

  let icon, title, description, variant;

  if (!isConnected) {
    icon = <WifiOff className="h-4 w-4" />;
    title = "Server Disconnected";
    description = "Unable to connect to the WhatsApp server. Please check your internet connection.";
    variant = "destructive";
  } else if (clientReady) {
    icon = <Check className="h-4 w-4" />;
    title = "WhatsApp Connected";
    description = "Your WhatsApp account is connected and ready to send messages.";
    variant = "default";
  } else {
    icon = <RefreshCw className="h-4 w-4 animate-spin" />;
    title = "Waiting for Connection";
    description = "Please scan the QR code with your WhatsApp to connect.";
    variant = "default";
  }

  return (
    <Alert 
      variant={variant === "destructive" ? "destructive" : "default"} 
      className="mb-6 border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 text-white"
    >
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${clientReady ? 'bg-green-500' : 'bg-gray-600'}`}></div>
        {icon}
      </div>
      <AlertTitle className="flex items-center gap-2 text-white">
        {title}
        {clientReady && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout} 
            className="ml-auto bg-transparent hover:bg-red-900/30 border-red-700 text-red-400 hover:text-red-300"
          >
            Disconnect
          </Button>
        )}
      </AlertTitle>
      <AlertDescription className="text-gray-300">
        {description}
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionStatus;
