import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = '', disabled = false, whileHover, whileTap, ...props }) => {
    return (
        <motion.button
            onClick={onClick}
            className={className}
            disabled={disabled}
            whileHover={whileHover}
            whileTap={whileTap}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;