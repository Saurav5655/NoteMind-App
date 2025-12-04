import React from 'react';

const LandingFooter = () => {
    return (
        <footer className="bg-muted/30 border-t border-border pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="text-2xl">🧠</div>
                            <h3 className="text-xl font-bold">NoteMind</h3>
                        </div>
                        <p className="text-muted-foreground">Transform your ideas into intelligent notes with AI-powered organization.</p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2">
                            <li><a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
                            <li><a href="#security" className="text-muted-foreground hover:text-primary transition-colors">Security</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</a></li>
                            <li><a href="#careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li><a href="#help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
                            <li><a href="#docs" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
                            <li><a href="#community" className="text-muted-foreground hover:text-primary transition-colors">Community</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
                    <p>&copy; {new Date().getFullYear()} NoteMind. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
