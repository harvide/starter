import { BsKey } from 'react-icons/bs';
import {
  FaApple,
  FaBitbucket,
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaGitlab,
  FaGoogle,
  FaLinkedin,
  FaSlack,
  FaSpotify,
  FaTwitch,
  FaTwitter,
} from 'react-icons/fa';
import { SiFigma, SiKakao, SiNotion, SiZoom } from 'react-icons/si';
import { TbBrandAzure } from 'react-icons/tb';

export const oauthIconsMap: Partial<
  Record<string, React.ComponentType<{ className?: string }>>
> = {
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
