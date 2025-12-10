
import React from 'react';
import { motion } from 'framer-motion';

const skillsData = {
    "AI Capabilities": [
        "Layout Generation", "Content Writing", "Image Synthesis", "Code Optimization", "SEO Analysis"
    ],
    "Tech Stack": [
        "React Native", "Next.js 14", "Tailwind CSS", "Node.js", "Python AI"
    ],
    "Security": [
        "DDoS Protection", "SSL/TLS", "Auto-Patching", "Threat Detection", "Secure Auth"
    ]
};

const Skills = () => {
    return (
        <section id="skills" className="py-20">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Platform <span className="text-primary">Capabilities</span></h2>
                <p className="text-gray-400">Everything you need to build the next unicorn.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {Object.entries(skillsData).map(([category, skills], index) => (
                    <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                        className="glass-panel p-8 hover:bg-white/10 transition-colors duration-300"
                    >
                        <h3 className="text-xl font-bold mb-6 text-secondary border-b border-white/10 pb-4">{category}</h3>

                        <div className="flex flex-wrap gap-3">
                            {skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:border-accent hover:shadow-[0_0_15px_rgba(75,255,179,0.3)] transition-all duration-300 cursor-default"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Skills;
