'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  BarChart3,
  Trophy,
  Users,
  Shield,
  Zap,
  ChevronDown,
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  ArrowRight,
  Target,
  Database,
  Cpu,
  Network,
} from 'lucide-react';
import Image from 'next/image';
import './landing.css';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image
                src="/assets/logos/HELiiX/HELiiX-Pri-Blk1028x1028.svg"
                alt="HELiiX Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-xl font-bold">HELiiX</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('about')}
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('solutions')}
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                Solutions
              </button>
              <button
                onClick={() => scrollToSection('case-study')}
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                Case Studies
              </button>
              <button
                onClick={() => scrollToSection('team')}
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                Team
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                Contact
              </button>
            </div>

            <Button
              onClick={() => scrollToSection('contact')}
              className="magnetic-button bg-black text-white hover:bg-gray-800"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center relative overflow-hidden heliix-neural-network"
      >
        <div className="absolute inset-0 heliix-particle-bg opacity-30"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="animate-logo-reveal mb-8">
            <Image
              src="/assets/logos/HELiiX/HELiiX-Pri-Blk1028x1028.svg"
              alt="HELiiX AI Solutions"
              width={96}
              height={96}
              className="h-24 w-24 mx-auto mb-6 animate-float"
            />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            <span className="heliix-text-gradient">HELiiX</span>
          </h1>

          <p
            className="text-xl md:text-2xl text-gray-600 mb-8 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            Pioneering AI Innovation for Collegiate Athletics
          </p>

          <p
            className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            We transform collegiate athletics through cutting-edge AI solutions, empowering
            conferences to make data-driven decisions and enhance competitive excellence.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            <Button
              onClick={() => scrollToSection('solutions')}
              size="lg"
              className="magnetic-button bg-black text-white hover:bg-gray-800"
            >
              Explore Solutions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={() => scrollToSection('case-study')}
              variant="outline"
              size="lg"
              className="magnetic-button border-black text-black hover:bg-gray-50"
            >
              View Case Studies
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown
            className="h-6 w-6 text-gray-400 cursor-pointer"
            onClick={() => scrollToSection('about')}
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">About HELiiX</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We transform collegiate athletics through cutting-edge AI solutions, empowering
              conferences to make data-driven decisions and enhance competitive excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Brain className="h-12 w-12 mx-auto mb-4 text-black" />
                <CardTitle>AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Advanced machine learning algorithms provide deep insights into athletic
                  performance and strategic optimization.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-black" />
                <CardTitle>Data-Driven Decisions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Transform raw data into actionable intelligence that drives competitive
                  advantage and operational excellence.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Trophy className="h-12 w-12 mx-auto mb-4 text-black" />
                <CardTitle>Championship Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Optimize championship events and competitions through intelligent analytics
                  and strategic planning tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive AI solutions designed specifically for collegiate athletics and
              conference management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <Target className="h-8 w-8 mb-3 text-black group-hover:scale-110 transition-transform" />
                <CardTitle>Performance Analytics & Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Advanced analytics platform providing real-time performance metrics,
                  predictive modeling, and strategic insights for athletic programs.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <Trophy className="h-8 w-8 mb-3 text-black group-hover:scale-110 transition-transform" />
                <CardTitle>Championship Event Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Intelligent scheduling, venue optimization, and resource allocation for
                  championship events and tournaments.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <Users className="h-8 w-8 mb-3 text-black group-hover:scale-110 transition-transform" />
                <CardTitle>Strategic Competition Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive tools for managing competitive balance, scheduling
                  optimization, and strategic conference planning.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <Zap className="h-8 w-8 mb-3 text-black group-hover:scale-110 transition-transform" />
                <CardTitle>Digital Transformation Consulting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Expert guidance on implementing AI-driven solutions and modernizing
                  athletic program operations.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <Cpu className="h-8 w-8 mb-3 text-black group-hover:scale-110 transition-transform" />
                <CardTitle>Custom AI Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tailored AI solutions designed to meet specific conference and athletic
                  program requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <Shield className="h-8 w-8 mb-3 text-black group-hover:scale-110 transition-transform" />
                <CardTitle>Security & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Enterprise-grade security and compliance solutions ensuring data
                  protection and regulatory adherence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Technology Stack</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on cutting-edge AI/ML technologies with enterprise-grade security and
              scalability.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Database className="h-12 w-12 mx-auto mb-4 text-black" />
              <h3 className="font-semibold mb-2">Machine Learning</h3>
              <p className="text-sm text-gray-600">TensorFlow, PyTorch, Scikit-learn</p>
            </div>

            <div className="text-center">
              <Network className="h-12 w-12 mx-auto mb-4 text-black" />
              <h3 className="font-semibold mb-2">Cloud Infrastructure</h3>
              <p className="text-sm text-gray-600">AWS, Azure, Google Cloud</p>
            </div>

            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-black" />
              <h3 className="font-semibold mb-2">Security</h3>
              <p className="text-sm text-gray-600">SOC 2, GDPR, FERPA Compliant</p>
            </div>

            <div className="text-center">
              <Cpu className="h-12 w-12 mx-auto mb-4 text-black" />
              <h3 className="font-semibold mb-2">Integration</h3>
              <p className="text-sm text-gray-600">REST APIs, GraphQL, Webhooks</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="outline" className="border-black text-black">
                SOC 2 Type II
              </Badge>
              <Badge variant="outline" className="border-black text-black">
                GDPR Compliant
              </Badge>
              <Badge variant="outline" className="border-black text-black">
                FERPA Compliant
              </Badge>
              <Badge variant="outline" className="border-black text-black">
                99.9% Uptime SLA
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Highlight */}
      <section id="case-study" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Partnering with leading conferences to drive innovation and excellence in
              collegiate athletics.
            </p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-6">Big 12 Conference Partnership</h3>
                  <p className="text-lg text-gray-600 mb-8">
                    "HELiiX AI Solutions has transformed how we approach championship event
                    management and strategic planning. Their innovative AI platform has
                    enabled us to optimize our operations and enhance the competitive
                    experience for our member institutions."
                  </p>

                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-black mb-2">40%</div>
                      <div className="text-sm text-gray-600">Efficiency Improvement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-black mb-2">25%</div>
                      <div className="text-sm text-gray-600">Cost Reduction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-black mb-2">95%</div>
                      <div className="text-sm text-gray-600">Satisfaction Rate</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    — Big 12 Conference Leadership Team
                  </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg">
                  <h4 className="text-xl font-semibold mb-6">Key Achievements</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">
                        Streamlined championship event scheduling and management
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">
                        Enhanced competitive balance through data-driven insights
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">
                        Improved resource allocation and operational efficiency
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">
                        Real-time analytics and performance monitoring
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Industry experts with deep experience in AI, athletics, and technology
              innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6"></div>
                <h3 className="text-xl font-bold mb-2">Dr. Sarah Chen</h3>
                <p className="text-gray-600 mb-4">Chief Executive Officer</p>
                <p className="text-sm text-gray-500 mb-4">
                  Former VP of Analytics at ESPN, PhD in Computer Science from Stanford.
                  15+ years in sports technology and AI.
                </p>
                <Button variant="ghost" size="sm" className="text-black hover:bg-gray-100">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6"></div>
                <h3 className="text-xl font-bold mb-2">Michael Rodriguez</h3>
                <p className="text-gray-600 mb-4">Chief Technology Officer</p>
                <p className="text-sm text-gray-500 mb-4">
                  Former Principal Engineer at Google AI, MS in Machine Learning from MIT.
                  Expert in scalable AI systems.
                </p>
                <Button variant="ghost" size="sm" className="text-black hover:bg-gray-100">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6"></div>
                <h3 className="text-xl font-bold mb-2">Jennifer Thompson</h3>
                <p className="text-gray-600 mb-4">VP of Strategic Partnerships</p>
                <p className="text-sm text-gray-500 mb-4">
                  Former Director of Operations at NCAA, MBA from Wharton. 20+ years in
                  collegiate athletics administration.
                </p>
                <Button variant="ghost" size="sm" className="text-black hover:bg-gray-100">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Get Started</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to transform your athletic program with AI? Let's discuss how HELiiX
              can help you achieve your goals.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-4 text-black" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">contact@heliix.io</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-4 text-black" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">Irving, TX</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <Button variant="ghost" size="sm" className="text-black hover:bg-gray-100">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-black hover:bg-gray-100">
                    <Twitter className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Partnership Inquiry</CardTitle>
                <p className="text-gray-600">
                  Tell us about your needs and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First Name" />
                  <Input placeholder="Last Name" />
                </div>
                <Input placeholder="Email" type="email" />
                <Input placeholder="Organization" />
                <Textarea placeholder="Tell us about your needs..." rows={4} />
                <Button className="w-full magnetic-button bg-black text-white hover:bg-gray-800">
                  Send Message
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/assets/logos/HELiiX/HELiiX-Pri-Wht1028x1028.svg"
                  alt="HELiiX Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold">HELiiX</span>
              </div>
              <p className="text-gray-400 text-sm">
                Pioneering AI Innovation for Collegiate Athletics
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Performance Analytics
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Championship Management
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Strategic Planning
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Custom Development
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Team
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    News
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2024 HELiiX AI Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}