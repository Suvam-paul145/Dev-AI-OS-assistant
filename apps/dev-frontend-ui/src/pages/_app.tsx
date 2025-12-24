import type { AppProps } from 'next/app';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReactLenis root>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </ReactLenis>
  );
}
