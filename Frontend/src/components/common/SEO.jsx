import React, { useEffect } from "react";

/**
 * SEO Component
 * Dynamically updates document title and meta tags for SEO and social sharing.
 *
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} props.keywords - Meta keywords
 * @param {string} props.ogTitle - Open Graph title (defaults to title)
 * @param {string} props.ogDescription - Open Graph description (defaults to description)
 * @param {string} props.ogImage - Open Graph image URL
 * @param {string} props.ogType - Open Graph type (e.g., 'website', 'product')
 */
const SEO = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
}) => {
  useEffect(() => {
    // Update Document Title
    const baseTitle = "MealMate";
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;

    // Helper to update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      if (!content) return;
      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement("meta");
        if (property) element.setAttribute("property", name);
        else element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Standard Meta Tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    // Open Graph Tags
    updateMetaTag("og:title", ogTitle || title, true);
    updateMetaTag("og:description", ogDescription || description, true);
    updateMetaTag("og:type", ogType, true);
    if (ogImage) updateMetaTag("og:image", ogImage, true);

    // Twitter Tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", ogTitle || title);
    updateMetaTag("twitter:description", ogDescription || description);
    if (ogImage) updateMetaTag("twitter:image", ogImage);
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogType]);

  return null; // Side-effect only component
};

export default SEO;
