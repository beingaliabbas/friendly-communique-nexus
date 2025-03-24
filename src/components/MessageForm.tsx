
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

interface MessageFormProps {
  apiKey: string | null;
  clientReady: boolean;
}

interface FormValues {
  phoneNumber: string;
  message: string;
}

export const MessageForm: React.FC<MessageFormProps> = ({ apiKey, clientReady }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    defaultValues: {
      phoneNumber: '',
      message: ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    if (!apiKey || !clientReady) {
      toast({
        title: "Error",
        description: "WhatsApp client is not connected. Please scan the QR code first.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await sendMessage(apiKey, data.phoneNumber, data.message);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Message sent successfully!",
        });
        form.reset();
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
    <Card>
      <CardHeader>
        <CardTitle>Send WhatsApp Message</CardTitle>
        <CardDescription>
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. 923001234567" 
                      {...field} 
                      disabled={isSubmitting || !clientReady}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the full phone number with country code, without spaces or special characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Type your message here..." 
                      className="min-h-[120px]" 
                      {...field} 
                      disabled={isSubmitting || !clientReady}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
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
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <p>Powered by WhatsApp Web.js</p>
      </CardFooter>
    </Card>
  );
};

export default MessageForm;
