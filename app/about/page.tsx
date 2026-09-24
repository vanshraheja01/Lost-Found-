import type { Metadata } from "next";
import Image from "next/image";
import { Geist } from "next/font/google";
import ScrollReveal from "@/components/ScrollReveal";
import styles from "./page.module.css";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "About Me | Lost & Found",
  description: "About Vansh Raheja, B.Tech CSE student at GGSIPU.",
};

const INTERESTS = [
  "Full Stack Development",
  "Frontend",
  "Backend",
  "AI",
  "APIs",
  "DSA",
  "Problem Solving",
  "Creative Technology",
];

const SKILLS = ["React.js", "JavaScript", "Node.js", "Python", "REST APIs", "HTML", "CSS", "Git", "GitHub"];

function GraduationCapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div className={`${styles.page} ${geistSans.className}`}>
      <main className={styles.main}>
        <div className={styles.glowLayer} aria-hidden>
          <div className={`${styles.heroGlow} ${styles.glowPrimary}`} />
          <div className={`${styles.heroGlow} ${styles.glowEmerald}`} style={{ animationDelay: "-8s" }} />
        </div>

        <div className={styles.grid}>
          <div>
            <ScrollReveal index={0}>
              <p className={styles.eyebrow}>About Me</p>
            </ScrollReveal>

            <ScrollReveal index={1}>
              <h1 className={styles.name}>Vansh Raheja</h1>
            </ScrollReveal>

            <ScrollReveal index={2}>
              <p className={styles.lead}>
                I&apos;m a B.Tech Computer Science &amp; Engineering student at GGSIPU, with a strong interest
                in building modern, practical, and user-focused digital experiences.
              </p>
            </ScrollReveal>

            <ScrollReveal index={3}>
              <h2 className={styles.subheading}>My interests</h2>
              <p className={`${styles.body} ${styles.mt3}`}>
                span Full Stack Development, Frontend Development, Backend Development, AI, APIs, Data
                Structures &amp; Algorithms, and creative problem-solving. I enjoy exploring new technologies,
                understanding how systems work, and turning ideas into applications that are useful in the
                real world.
              </p>
            </ScrollReveal>

            <ScrollReveal index={4}>
              <p className={`${styles.body} ${styles.mt4}`}>
                I work with technologies including React.js, JavaScript, Node.js, Python, REST APIs, HTML,
                CSS, Git, and GitHub, with a foundation in Object-Oriented Programming, Data Structures &amp;
                Algorithms, and client-server architecture.
              </p>
            </ScrollReveal>

            <ScrollReveal index={5}>
              <p className={`${styles.body} ${styles.mt4}`}>
                I believe development is a continuous journey of learning, experimenting, building, and
                improving — and I&apos;m always looking for the next idea to turn into something meaningful.
              </p>
            </ScrollReveal>

            <ScrollReveal index={6}>
              <p className={styles.motto}>Learning. Building. Creating. Evolving.</p>
            </ScrollReveal>

            <ScrollReveal index={7}>
              <div className={styles.eduCard}>
                <GraduationCapIcon className={styles.eduIcon} />
                <div>
                  <p className={styles.eduTitle}>B.Tech — Computer Science &amp; Engineering</p>
                  <p className={styles.eduSub}>GGSIPU (Guru Gobind Singh Indraprastha University)</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal index={8}>
              <div className={styles.mt8}>
                <p className={styles.tagLabel}>Interests</p>
                <div className={styles.tags}>
                  {INTERESTS.map((interest) => (
                    <span key={interest} className={`${styles.badge} ${styles.badgeInfo}`}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal index={9}>
              <div className={styles.mt6}>
                <p className={styles.tagLabel}>Skills</p>
                <div className={styles.tags}>
                  {SKILLS.map((skill) => (
                    <span key={skill} className={`${styles.badge} ${styles.badgeDefault}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal index={2} className={styles.photoColumn}>
            <div className={styles.photoCard}>
              <div className={styles.photoFrame}>
                <Image
                  src="/images/vansh-raheja.jpg"
                  alt="Vansh Raheja"
                  fill
                  sizes="(min-width: 1024px) 380px, 100vw"
                  className={styles.photo}
                  style={{ objectPosition: "50% 18%" }}
                  priority
                />
              </div>
              <div className={styles.photoCaption}>
                <p className={styles.captionName}>Vansh Raheja</p>
                <p className={styles.captionRole}>B.Tech CSE Student, GGSIPU</p>
              </div>
            </div>
            <p className={styles.photoMotto}>Learning. Building. Creating. Evolving.</p>
          </ScrollReveal>
        </div>
      </main>
    </div>
  );
}
