import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Users, Lightbulb, TrendingUp, BookOpen, GraduationCap, Briefcase, Heart, Award, Globe, Zap } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { FadeIn, StaggeredFadeIn } from "@/components/ui/animations";

export const metadata: Metadata = {
  title: "About Us - NeuraDock Knowledge Hub",
  description: "Learn about NeuraDock and founder Malik Mohsin Saleem Khan. Our mission to democratize knowledge in Finance, Technology, Education, and Business.",
  keywords: ["about neuradock", "malik mohsin saleem khan", "knowledge hub", "finance education", "technology insights"],
  openGraph: {
    title: "About NeuraDock - Knowledge Hub",
    description: "Founded by Malik Mohsin Saleem Khan, NeuraDock democratizes knowledge across Finance, Technology, Education, and Business.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About NeuraDock - Knowledge Hub",
    description: "Founded by Malik Mohsin Saleem Khan, NeuraDock democratizes knowledge across Finance, Technology, Education, and Business.",
  },
};

export default function AboutPage() {
  const achievements = [
    {
      icon: Award,
      title: "Industry Recognition",
      description: "Recognized thought leader in finance, technology, and business innovation"
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description: "International experience in emerging markets and digital transformation"
    },
    {
      icon: Zap,
      title: "Innovation Focus",
      description: "Passionate about leveraging technology to solve complex business challenges"
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Accuracy",
      description: "We prioritize factual, well-researched content backed by credible sources and expert insights."
    },
    {
      icon: Users,
      title: "Accessibility",
      description: "Complex topics made simple. We believe knowledge should be accessible to everyone, regardless of background."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We explore cutting-edge trends and emerging ideas that shape the future of business and technology."
    },
    {
      icon: Heart,
      title: "Community",
      description: "Building a community of learners, professionals, and thought leaders who share knowledge and insights."
    }
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <FadeIn className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">About NeuraDock</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Founded and led by Malik Mohsin Saleem Khan, NeuraDock is your comprehensive knowledge hub for insights on Finance, Technology, Education, and Business.
            We bridge the gap between complex concepts and practical understanding.
          </p>
        </FadeIn>

        {/* Founder Section */}
        <div className="mb-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-none">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="order-2 lg:order-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Founder</h2>
                  <h3 className="text-2xl font-semibold text-blue-600 mb-4">Malik Mohsin Saleem Khan</h3>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    A visionary entrepreneur and thought leader with extensive experience in finance, technology, and business innovation.
                    Malik founded NeuraDock with the mission to democratize knowledge and empower individuals and organizations
                    to make informed decisions in an increasingly complex world.
                  </p>
                  <p className="text-gray-700 mb-6">
                    With a passion for emerging technologies and their practical applications, Malik brings a unique perspective
                    that combines deep technical knowledge with real-world business acumen. His expertise spans across multiple
                    domains, making him uniquely positioned to provide comprehensive insights on the topics that matter most
                    in today's rapidly evolving landscape.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <achievement.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-sm text-gray-900 mb-1">{achievement.title}</h4>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="order-1 lg:order-2 flex justify-center">
                  <div className="relative">
                    <Image
                      src="/images/malik-mohsin.jpg"
                      alt="Malik Mohsin Saleem Khan - Founder of NeuraDock"
                      width={300}
                      height={300}
                      className="rounded-full shadow-xl border-4 border-white"
                      priority
                    />
                    <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg">
                      <Briefcase className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                To democratize knowledge by providing high-quality, accessible content that empowers individuals 
                and organizations to make informed decisions in an increasingly complex world. We believe that 
                understanding finance, technology, education, and business fundamentals is essential for personal 
                and professional growth in the 21st century.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What We Cover */}
        <div className="mb-16">
          <FadeIn>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Cover</h2>
          </FadeIn>
          <StaggeredFadeIn
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            staggerDelay={150}
          >
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Finance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Investment strategies, market analysis, personal finance, and economic trends that impact your financial future.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Latest tech trends, AI developments, digital transformation, and how technology reshapes industries.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Education</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Learning methodologies, skill development, educational technology, and lifelong learning strategies.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Business</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Entrepreneurship, business strategy, leadership insights, and industry analysis for modern professionals.
                </p>
              </CardContent>
            </Card>
          </StaggeredFadeIn>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Vision & Expertise Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Vision & Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  <span>Financial Innovation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Deep expertise in financial markets, investment strategies, and emerging fintech solutions.
                  Malik provides insights that help individuals and businesses navigate complex financial landscapes
                  with confidence and clarity.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl flex items-center space-x-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  <span>Technology Leadership</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Extensive experience in emerging technologies including AI, blockchain, and digital transformation.
                  Malik bridges the gap between technical innovation and practical business applications.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl flex items-center space-x-2">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                  <span>Educational Excellence</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Passionate about knowledge sharing and educational innovation. Malik believes in making complex
                  concepts accessible and actionable for learners at all levels.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl flex items-center space-x-2">
                  <Briefcase className="h-6 w-6 text-orange-600" />
                  <span>Business Strategy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Proven track record in business development, strategic planning, and entrepreneurship.
                  Malik helps organizations identify opportunities and implement effective growth strategies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
            <CardHeader>
              <CardTitle className="text-3xl font-bold mb-4">Join Our Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl mb-6 opacity-90">
                Stay updated with the latest insights and connect with like-minded professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/contact" className="flex items-center justify-center">Get in Touch</Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                  Subscribe to Newsletter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
