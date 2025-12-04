import React from 'react';

const FeaturesSection = () => {
    const features = [
        {
            icon: "🤖",
            title: "AI-Powered Intelligence",
            description: "Smart suggestions, automatic categorization, and intelligent search that understands context."
        },
        {
            icon: "⚡",
            title: "Lightning Fast",
            description: "Search and organize your notes in milliseconds with our optimized engine."
        },
        {
            icon: "🔒",
            title: "Enterprise Security",
            description: "End-to-end encryption and secure cloud storage for your peace of mind."
        },
        {
            icon: "📱",
            title: "Cross-Platform",
            description: "Seamless sync across all your devices with real-time collaboration."
        },
        {
            icon: "🎨",
            title: "Beautiful Design",
            description: "Clean, modern interface that makes note-taking a pleasure."
        },
        {
            icon: "🔗",
            title: "Smart Connections",
            description: "Automatically link related notes and discover hidden connections."
        }
    ];

    return (
        <section className="py-24 bg-accent/5" id="features">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Why Choose NoteMind?</h2>
                    <p className="text-muted-foreground text-lg">Powerful features designed for modern productivity</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow hover:border-primary/50 group">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
