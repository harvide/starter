import { Provider } from "@supabase/supabase-js";
import {
  FaGithub,
  FaGoogle,
  FaDiscord,
  FaApple,
  FaFacebook,
  FaSlack,
  FaSpotify,
  FaTwitch,
  FaTwitter,
  FaLinkedin,
  FaBitbucket,
  FaGitlab,
} from "react-icons/fa";
import { SiNotion, SiFigma, SiZoom, SiKakao } from "react-icons/si";
import { TbBrandAzure } from "react-icons/tb";
import { BsKey } from "react-icons/bs";

export const oauthIconsMap: Partial<Record<Provider, React.ComponentType<{ className?: string }>>> = {
  apple: FaApple,
  azure: TbBrandAzure,
  bitbucket: FaBitbucket,
  discord: FaDiscord,
  facebook: FaFacebook,
  figma: SiFigma,
  github: FaGithub,
  gitlab: FaGitlab,
  google: FaGoogle,
  kakao: SiKakao,
  keycloak: BsKey,
  linkedin: FaLinkedin,
  linkedin_oidc: FaLinkedin,
  notion: SiNotion,
  slack: FaSlack,
  slack_oidc: FaSlack,
  spotify: FaSpotify,
  twitch: FaTwitch,
  twitter: FaTwitter,
  zoom: SiZoom,
};
