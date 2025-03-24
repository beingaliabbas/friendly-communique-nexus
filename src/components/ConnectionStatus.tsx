
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
    <Alert variant={variant === "destructive" ? "destructive" : "default"} className="mb-6">
      {icon}
      <AlertTitle className="flex items-center gap-2">
        {title}
        {clientReady && (
          <Button variant="outline" size="sm" onClick={handleLogout} className="ml-auto">
            Logout
          </Button>
        )}
      </AlertTitle>
      <AlertDescription>
        {description}
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionStatus;
