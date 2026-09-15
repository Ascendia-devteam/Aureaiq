import { useDisclosure } from '@/hooks/useDisclosure';
import { useScrollTriggerRefresh } from '@/hooks/animations';
import { AppProviders } from '@/providers/AppProviders';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';
import { Masthead } from '@/components/layout/Masthead';
import { OverlayMenu } from '@/components/layout/OverlayMenu';
import { Footer } from '@/components/layout/Footer';
import { CursorFollower } from '@/components/ui/CursorFollower';
import { Preloader } from '@/components/ui/Preloader';
import { HomePage } from '@/pages/HomePage';

const MENU_ID = 'overlay-menu';

/**
 * Everything above the page itself.
 *
 * The masthead, the overlay menu, the cursor and the curtain all sit
 * outside SmoothScrollProvider's wrapper: ScrollSmoother transforms its
 * content element, and a fixed element inside a transformed ancestor is
 * positioned against that ancestor rather than the viewport.
 */
function Site() {
  const menu = useDisclosure();
  useScrollTriggerRefresh();

  return (
    <>
      <Preloader />
      <CursorFollower />

      <Masthead isMenuOpen={menu.isOpen} onToggleMenu={menu.toggle} menuId={MENU_ID} />
      <OverlayMenu id={MENU_ID} isOpen={menu.isOpen} onClose={menu.close} />

      <SmoothScrollProvider>
        <HomePage />
        <Footer />
      </SmoothScrollProvider>
    </>
  );
}

export default function App() {
  return (
    <AppProviders>
      <Site />
    </AppProviders>
  );
}
