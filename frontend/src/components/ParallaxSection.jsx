import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxSection({ children, offset = 50, className = "" }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

    return (
        <motion.div
            ref={ref}
            style={{ y }}
            className={`relative z-10 ${className}`}
        >
            {children}
        </motion.div>
    );
}
