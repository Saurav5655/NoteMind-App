import React from 'react';

const TestimonialsSection = () => {
    return (
        <section className="testimonials">
            <div className="section-header">
                <h2>Loved by Users Worldwide</h2>
                <p>See what our community has to say</p>
            </div>
            <div className="testimonials-grid">
                <div className="testimonial-card">
                    <div className="testimonial-content">
                        <p>&quot;NoteMind has completely transformed how I organize my thoughts. The AI suggestions are incredibly helpful!&quot;</p>
                    </div>
                    <div className="testimonial-author">
                        <div className="author-avatar">👩‍💼</div>
                        <div className="author-info">
                            <h4>Sarah Chen</h4>
                            <span>Product Manager</span>
                        </div>
                    </div>
                </div>
                <div className="testimonial-card">
                    <div className="testimonial-content">
                        <p>&quot;The best note-taking app I&apos;ve ever used. Clean, fast, and the AI features are game-changing.&quot;</p>
                    </div>
                    <div className="testimonial-author">
                        <div className="author-avatar">👨‍💻</div>
                        <div className="author-info">
                            <h4>Alex Rodriguez</h4>
                            <span>Software Engineer</span>
                        </div>
                    </div>
                </div>
                <div className="testimonial-card">
                    <div className="testimonial-content">
                        <p>&quot;Finally, a note app that understands my workflow. The smart categorization is brilliant!&quot;</p>
                    </div>
                    <div className="testimonial-author">
                        <div className="author-avatar">👩‍🎓</div>
                        <div className="author-info">
                            <h4>Emma Wilson</h4>
                            <span>Researcher</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
