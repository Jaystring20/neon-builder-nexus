import { Helmet } from "react-helmet-async";

const SITE_NAME = "Digital Creatives Hub";

/**
 * The origin the site is actually served from.
 *
 * This pointed at digitalcreativeshub.com, a different domain the company owns
 * and uses for email, so every page told search engines that the canonical
 * version of itself lived somewhere the site does not exist. That asks them to
 * index the wrong host and splits any ranking between the two.
 *
 * The www form is deliberate: the apex 308-redirects to www, and a canonical
 * should name the URL that serves the content rather than one that bounces.
 */
const BASE_URL = "https://www.digitalcreativeshubltd.com";
const DEFAULT_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/Y2zF3uaJHjh13RMvylpGg9mu4BJ3/social-images/social-1765923602293-The Digital Creatives Hub Logo.png";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

const SEO = ({ title, description, path = "", image = DEFAULT_IMAGE }: SEOProps) => {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const url = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

export default SEO;
