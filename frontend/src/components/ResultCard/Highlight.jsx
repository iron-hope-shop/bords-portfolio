// Highlight.jsx
import React from 'react';

export const Highlight = ({ text = '', searchTerm = '' }) => {
  if (!searchTerm || !text) return text;

  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedSearchTerm = escapeRegExp(searchTerm);
  const parts = text.toString().split(new RegExp(`(${escapedSearchTerm})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === searchTerm.toLowerCase()
      ? <mark key={i} style={{ backgroundColor: 'yellow', border: "2px solid yellow" }}>{part}</mark>
      : part
  );
};
