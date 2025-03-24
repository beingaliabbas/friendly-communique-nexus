
import React, { useState } from 'react';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { sendMessage } from '@/lib/socketService';
import { useForm } from 'react-hook-form';
import { Send, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface MessageFormProps {
  apiKey: string | null;
  clientReady: boolean;
}

const formSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  message: z.string().min(1, "Message is required"),
  apiKey: z.string().min(1, "API Key is required")
});

type FormValues = z.infer<typeof formSchema>;

export const MessageForm: React.FC<MessageFormProps> = ({ apiKey, clientReady }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: '',
      message: '',
      apiKey: apiKey || ''
    }
  });

  // Update API key in the form when it changes
  React.useEffect(() => {
    if (apiKey) {
      form.setValue('apiKey', apiKey);
    }
  }, [apiKey, form]);

  const onSubmit = async (data: FormValues) => {
    if (!clientReady) {
      toast({
        title: "Error",
        description: "WhatsApp client is not connected. Please scan the QR code first.",
        variant: "destructive",
      });
      return;
    }

    if (data.apiKey !== apiKey) {
      toast({
        title: "Error",
        description: "Invalid API key. Please use the provided API key.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await sendMessage(data.apiKey, data.phoneNumber, data.message);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Message sent successfully!",
        });
        form.reset({
          phoneNumber: '',
          message: '',
          apiKey: apiKey || ''
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to send the message.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Message Composer</CardTitle>
        <CardDescription className="text-gray-300">
          Send a message to any WhatsApp number
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Recipient Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. 923001234567" 
                      {...field} 
                      disabled={isSubmitting || !clientReady}
                      className="bg-gray-800 text-white border-gray-700 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Enter the full phone number with country code, without spaces or special characters.
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Message Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Type your message here..." 
                      className="min-h-[120px] bg-gray-800 text-white border-gray-700 focus-visible:ring-indigo-500 focus-visible:border-indigo-500" 
                      {...field} 
                      disabled={isSubmitting || !clientReady}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">API Key</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={isSubmitting || !clientReady}
                      className="bg-gray-800 text-white border-gray-700 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white" 
              disabled={isSubmitting || !clientReady}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-gray-400">
        <p>Powered by WhatsApp Web.js</p>
      </CardFooter>
    </Card>
  );
};

export default MessageForm;
