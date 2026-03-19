import { Helmet } from "react-helmet-async";

const SITE_NAME = "Digital Creatives Hub";
const BASE_URL = "https://digitalcreativeshub.com";
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
