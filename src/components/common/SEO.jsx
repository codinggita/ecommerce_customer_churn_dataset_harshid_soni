import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, url = 'https://churnanalytics.com' }) {
  const fullTitle = `${title} | Customer Churn Dashboard`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${url}/og-image.jpg`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${url}/og-image.jpg`} />
      
      {/* JSON-LD for Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": fullTitle,
          "description": description,
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "All"
        })}
      </script>
    </Helmet>
  );
}
