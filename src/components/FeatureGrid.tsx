
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FeatureGrid = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
          Transform Your Business with AI
        </h2>
        <p className="text-xl text-gray-300 leading-relaxed">
          Join thousands of professionals already leveraging artificial intelligence to accelerate growth and innovation.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Expert-Led Learning */}
        <Card className="bg-blue-800/50 border-blue-600/50 backdrop-blur-sm hover:bg-blue-800/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
              🎓 Expert-Led Learning
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-200">
            <p className="mb-4 leading-relaxed">
              Access comprehensive AI education designed by industry leaders and practitioners.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Structured learning paths</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Real-world case studies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Industry certifications</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Professional Tools */}
        <Card className="bg-purple-800/50 border-purple-600/50 backdrop-blur-sm hover:bg-purple-800/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
              🛠️ Professional Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-200">
            <p className="mb-4 leading-relaxed">
              Enterprise-grade AI tools to streamline workflows and boost productivity.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✓</span>
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✓</span>
                <span>Process automation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✓</span>
                <span>Team collaboration</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Strategic Insights */}
        <Card className="bg-blue-600/50 border-blue-400/50 backdrop-blur-sm hover:bg-blue-600/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-400/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
              📊 Strategic Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-200">
            <p className="mb-4 leading-relaxed">
              Data-driven insights to make informed decisions and stay ahead of the competition.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-300">✓</span>
                <span>Market intelligence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300">✓</span>
                <span>Performance metrics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300">✓</span>
                <span>Competitive analysis</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeatureGrid;
