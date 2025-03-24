
import React, { useState } from 'react';
import { Copy, Check, Key, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';

interface ApiKeyDisplayProps {
  apiKey: string | null;
}

export const ApiKeyDisplay: React.FC<ApiKeyDisplayProps> = ({ apiKey }) => {
  const [copied, setCopied] = useState(false);
  const [pin, setPin] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();

  if (!apiKey) {
    return null;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The API key has been copied to your clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReveal = () => {
    if (pin === '6878') {
      setShowApiKey(true);
      setRevealed(true);
    } else {
      toast({
        title: "Invalid PIN",
        description: "The PIN you entered is incorrect",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-6 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
          <Key className="h-4 w-4" />
          API Key Management
        </CardTitle>
        <CardDescription className="text-gray-300">
          Protect and manage your API credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!revealed ? (
          <div className="space-y-4">
            <Input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter Security PIN"
              className="bg-gray-800 text-white border-gray-700 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
            />
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
              onClick={handleReveal}
            >
              Reveal API Key
            </Button>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            <label className="text-gray-300 text-sm">Your API Key:</label>
            <div className="flex items-center gap-2 mt-2">
              <code className="relative rounded bg-gray-800 px-[0.3rem] py-[0.2rem] font-mono text-sm flex-1 overflow-x-auto p-3 text-indigo-400">
                {showApiKey ? apiKey : '••••••••••••••••'}
              </code>
              <Button
                variant="outline"
                size="sm"
                className="flex-shrink-0 h-8 bg-transparent border-gray-700 hover:bg-gray-700 text-gray-300"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-shrink-0 h-8 bg-transparent border-gray-700 hover:bg-gray-700 text-gray-300"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeyDisplay;
