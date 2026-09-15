import { About, Audience, Contact, Hero, Method, Practice, Quote } from '@/sections';

/**
 * The site is one page. Section order is the argument the page makes:
 * who we build for, who we are, what we do, how we work, what we
 * believe, how to start.
 *
 * Reordering it is reordering this list.
 */
export function HomePage() {
  return (
    <main id="top">
      <Hero />
      <Audience />
      <About />
      <Practice />
      <Method />
      <Quote />
      <Contact />
    </main>
  );
}
