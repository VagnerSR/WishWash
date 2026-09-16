import { Github, Linkedin, Globe } from "lucide-react";
import { THEME } from "../lib/theme";
import { useI18n } from "../i18n/I18nContext";

const AUTHOR_NAME = "Vagner Rosnoski";
const GITHUB_URL = "https://github.com/VagnerSR/WishWash";
const LINKEDIN_URL = "https://www.linkedin.com/in/vagner-da-silva-rosnoski/";
const PORTFOLIO_URL = "https://vagner-rosnoski.vercel.app/";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer style={{ color: THEME.inkSoft }} className="text-xs mt-10 text-center">
      <p>{t.footer}</p>
      <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        <span>
          {t.footerCredit} {AUTHOR_NAME}
        </span>
        <span className="inline-flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            style={{ color: THEME.inkSoft }}
            className="hover:opacity-70"
          >
            <Github size={14} />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            style={{ color: THEME.inkSoft }}
            className="hover:opacity-70"
          >
            <Linkedin size={14} />
          </a>
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Portfolio"
            style={{ color: THEME.inkSoft }}
            className="hover:opacity-70"
          >
            <Globe size={14} />
          </a>
        </span>
      </p>
    </footer>
  );
}
