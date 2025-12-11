import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxSection({ children, offset = 50, className = "" }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <motion.div
            ref={ref}
            style={{ y, opacity }}
            className={`relative z-10 ${className}`}
        >
            {children}
        </motion.div>
    );
}
