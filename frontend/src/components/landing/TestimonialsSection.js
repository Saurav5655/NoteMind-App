import React from 'react';

const TestimonialsSection = () => {
    const testimonials = [
        {
            quote: "NoteMind has completely transformed how I organize my thoughts. The AI suggestions are incredibly helpful!",
            author: "Sarah Chen",
            role: "Product Manager",
            avatar: "👩‍💼"
        },
        {
            quote: "The best note-taking app I've ever used. Clean, fast, and the AI features are game-changing.",
            author: "Alex Rodriguez",
            role: "Software Engineer",
            avatar: "👨‍💻"
        },
        {
            quote: "Finally, a note app that understands my workflow. The smart categorization is brilliant!",
            author: "Emma Wilson",
            role: "Researcher",
            avatar: "👩‍🎓"
        }
    ];

    return (
        <section className="py-24 px-6 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Loved by Users Worldwide</h2>
                    <p className="text-muted-foreground text-lg">See what our community has to say</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors">
                            <p className="text-lg mb-6 text-foreground/80 italic">&quot;{testimonial.quote}&quot;</p>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-2xl">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <h4 className="font-semibold">{testimonial.author}</h4>
                                    <span className="text-sm text-muted-foreground">{testimonial.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
