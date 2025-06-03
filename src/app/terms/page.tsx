import Link from "next/link";
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Shield, AlertTriangle } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";

export const metadata: Metadata = {
  title: "Terms of Service - NeuraDock Knowledge Hub",
  description: "NeuraDock's Terms of Service. Read our terms and conditions for using our platform and accessing our Finance, Technology, Education, and Business content.",
  keywords: ["terms of service", "terms and conditions", "neuradock terms", "user agreement"],
  openGraph: {
    title: "Terms of Service - NeuraDock",
    description: "Read NeuraDock's terms and conditions for using our knowledge platform.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service - NeuraDock",
    description: "NeuraDock's terms and conditions for platform usage.",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Header */}
        <FadeIn className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms and Conditions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using NeuraDock.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 2024
          </p>
        </FadeIn>

        {/* Terms Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>1. Acceptance of Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                By accessing and using NeuraDock ("the Service"), you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p>
                These Terms and Conditions constitute a legally binding agreement made between you and 
                Malik Mohsin Saleem Khan ("we," "us," or "our"), concerning your access to and use of the NeuraDock website.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Use License</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Permission is granted to temporarily download one copy of the materials on NeuraDock for personal, 
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul>
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                <li>attempt to decompile or reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
              <p>
                This license shall automatically terminate if you violate any of these restrictions and may be terminated 
                by us at any time. Upon terminating your viewing of these materials or upon the termination of this license, 
                you must destroy any downloaded materials in your possession whether in electronic or printed format.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Content and Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                All content published on NeuraDock, including but not limited to articles, images, graphics, logos, 
                and text, is the intellectual property of Malik Mohsin Saleem Khan unless otherwise stated.
              </p>
              <p>
                The content is provided for informational and educational purposes only. While we strive for accuracy, 
                we make no representations or warranties of any kind, express or implied, about the completeness, 
                accuracy, reliability, suitability, or availability of the information contained on the website.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span>4. Disclaimer</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                The materials on NeuraDock are provided on an 'as is' basis. To the fullest extent permitted by law, 
                this Company:
              </p>
              <ul>
                <li>excludes all representations and warranties relating to this website and its contents</li>
                <li>excludes all liability for damages arising out of or in connection with your use of this website</li>
              </ul>
              <p>
                Nothing on this website constitutes, or is meant to constitute, advice of any kind. If you require advice 
                in relation to any legal, financial, or medical matter you should consult an appropriate professional.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. User Conduct</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>You agree not to use the Service to:</p>
              <ul>
                <li>Upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, or otherwise objectionable</li>
                <li>Impersonate any person or entity or falsely state or misrepresent your affiliation with a person or entity</li>
                <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
                <li>Attempt to gain unauthorized access to any portion of the Service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, 
                to understand our practices.
              </p>
              <p>
                <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                  View our Privacy Policy
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Modifications</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                We may revise these terms of service at any time without notice. By using this website, 
                you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <ul>
                <li>Email: legal@neuradock.com</li>
                <li>Website: <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">Contact Us</Link></li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            These terms and conditions are effective as of January 2024.
          </p>
        </div>
      </div>
    </div>
  );
}
