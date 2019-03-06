import React from 'react';

import TemplateWrapper from '../components/TemplateWrapper';
import SEO from '../components/seo';

const NotFoundPage = () => (
  <TemplateWrapper>
    <SEO title="404: Not found" />
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </TemplateWrapper>
);

export default NotFoundPage;
