import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import introVideo from "../../assets/b2f/b2f-intro.mp4";
import videoImage from "../../assets/b2f/b2f-intro-image.png";

const VideoSection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVideoLoaded(true);
            // attempt play if video already mounted
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => { });
            }
          } else {
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // play when the video element is mounted after isVideoLoaded becomes true
  useEffect(() => {
    if (isVideoLoaded && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => { });
    }
  }, [isVideoLoaded]);

  return (
    <section className="bg-[#121212] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See How <span className="text-primary">Bet2Fund</span> Works
          </h2>
          <p className="text-white/80 text-lg">
            Watch our comprehensive overview of the funding process and
            challenge requirements.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative">
            <div className="absolute -inset-2 rounded-2xl bg-primary/20 blur-2xl"></div>
            <div className="relative bg-[#121212]/70 backdrop-blur-sm rounded-xl p-4 border border-primary/30 shadow-[0_0_20px_rgba(0,178,255,0.3)]">
              <div ref={containerRef} className="aspect-video bg-[#0a0a0a] rounded-lg flex items-center justify-center relative overflow-hidden">
                {isVideoLoaded && (
                  <video
                    ref={videoRef}
                    className="w-full h-full rounded-lg"
                    src={introVideo}
                    controls
                    playsInline
                    preload="metadata"
                    controlsList="nodownload"
                    muted
                    autoPlay
                  />
                )}
              </div>

              <div className="mt-4 text-center">
                <p className="text-white/60 text-sm">
                  Duration: ~1:35 &nbsp;|&nbsp; Overview of our evaluation
                  process, rules, and funding
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
