"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

export function NewsletterSignup({ variant = 'default', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      setStatus('success');
      setMessage('Thank you for subscribing! Check your email for confirmation.');
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 ${className}`}>
        <div className="flex items-center mb-4">
          <Mail className="h-6 w-6 text-primary mr-2" />
          <h3 className="text-lg font-semibold text-foreground">Stay Updated</h3>
        </div>
        <p className="text-muted-foreground mb-4 text-sm">
          Get the latest insights delivered to your inbox weekly.
        </p>
        
        {status === 'success' ? (
          <div className="flex items-center text-success">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span className="text-sm">{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
              disabled={status === 'loading'}
            />

            {status === 'error' && (
              <div className="flex items-center text-destructive text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {message}
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full"
              size="sm"
            >
              {status === 'loading' ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Subscribing...
                </div>
              ) : (
                'Subscribe'
              )}
            </Button>
          </form>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`bg-white border rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium text-foreground">Newsletter</span>
          </div>
        </div>

        {status === 'success' ? (
          <div className="flex items-center text-success">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
              disabled={status === 'loading'}
            />
            <Button 
              type="submit" 
              disabled={status === 'loading'}
              size="sm"
            >
              {status === 'loading' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                'Subscribe'
              )}
            </Button>
          </form>
        )}
        
        {status === 'error' && (
          <div className="flex items-center text-destructive text-sm mt-2">
            <AlertCircle className="h-4 w-4 mr-1" />
            {message}
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Stay in the Loop</CardTitle>
        <CardDescription>
          Get weekly insights on Finance, Technology, Education, and Business delivered straight to your inbox.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'success' ? (
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">You're all set!</h3>
            <p className="text-muted-foreground">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="newsletter-email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                disabled={status === 'loading'}
                required
              />
            </div>

            {status === 'error' && (
              <div className="flex items-center text-destructive">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">{message}</span>
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full"
            >
              {status === 'loading' ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Subscribing...
                </div>
              ) : (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Subscribe to Newsletter
                </div>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
