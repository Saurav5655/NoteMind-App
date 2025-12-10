import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
    {
        title: "SecureVault API",
        description: "Enterprise-grade encrypted file storage system with Zero-Knowledge Proof authentication.",
        tech: ["Node.js", "Express", "MongoDB", "AES-256"],
        link: "#"
    },
    {
        title: "CyberTreat Intel",
        description: "Real-time threat intelligence dashboard aggregating data from multiple OSINT sources.",
        tech: ["React", "Python", "D3.js", "Docker"],
        link: "#"
    },
    {
        title: "VulnScanner Pro",
        description: "Automated vulnerability scanner for web applications, detecting SQLi and XSS flaws.",
        tech: ["Python", "Selenium", "BeautifulSoup"],
        link: "#"
    }
];

const Projects = () => {
    return (
        <section id="projects" className="py-20 bg-black/20">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-px bg-white/10 flex-grow"></div>
                    <h2 className="text-3xl md:text-5xl font-display font-bold">Featured <span className="text-primary">Deployments</span></h2>
                    <div className="h-px bg-white/10 flex-grow"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                        >
                            {/* Holographic Border Effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent opacity-30 group-hover:opacity-100 transition duration-500 blur rounded-2xl"></div>

                            <div className="relative h-full bg-dark/90 backdrop-blur-xl border border-white/10 rounded-xl p-8 flex flex-col hover:bg-white/5 transition-colors duration-300">
                                <div className="mb-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-bold font-display group-hover:text-primary transition-colors">{project.title}</h3>
                                        <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-6">{project.description}</p>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.tech.map((t) => (
                                            <span key={t} className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <a href={project.link} className="inline-flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-white hover:text-primary transition-colors">
                                        View Project <span className="text-lg">›</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
