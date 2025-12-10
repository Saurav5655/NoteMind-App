import React from 'react';
import { Mail, Linkedin, Github } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="py-32 text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto px-4">
                <h2 className="text-5xl md:text-7xl font-display font-bold mb-8">
                    Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Connect</span>
                </h2>

                <p className="text-xl text-gray-400 mb-12">
                    Interested in collaborating on a project or discussing security strategies? My inbox is always open.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <a href="mailto:contact@eshan.sec" className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform duration-300 flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Send Email
                    </a>

                    <div className="flex gap-4">
                        <a href="#" className="p-4 rounded-full glass-panel hover:bg-white/10 hover:border-primary/50 transition-all duration-300 group">
                            <Linkedin className="w-6 h-6 text-gray-300 group-hover:text-primary" />
                        </a>
                        <a href="#" className="p-4 rounded-full glass-panel hover:bg-white/10 hover:border-white/50 transition-all duration-300 group">
                            <Github className="w-6 h-6 text-gray-300 group-hover:text-white" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
