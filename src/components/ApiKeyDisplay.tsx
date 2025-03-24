
import React, { useState } from 'react';
import { Copy, Check, Key } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ApiKeyDisplayProps {
  apiKey: string | null;
}

export const ApiKeyDisplay: React.FC<ApiKeyDisplayProps> = ({ apiKey }) => {
  const [copied, setCopied] = useState(false);

  if (!apiKey) {
    return null;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Key className="h-4 w-4" />
          API Key
        </CardTitle>
        <CardDescription>
          Use this key to authenticate your API requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm flex-1 overflow-x-auto">
            {apiKey}
          </code>
          <Button
            variant="outline"
            size="sm"
            className="flex-shrink-0 h-8"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyDisplay;
