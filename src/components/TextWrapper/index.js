import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { StaticQuery, graphql } from "gatsby";

import Auth from '../../containers/Auth';
import Header from '../Header';
import { Container as BaseContainerStyles } from '../../styledComponents/layout';

import './index.css';

const Container = styled(BaseContainerStyles)`
  padding-top: 0;
`;

const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

const TemplateWrapper = ({ children, data, ...props }) => (
  <Auth>
    {auth => {
      return (
        <StaticQuery
          query={query}
          render={data => (
            <div>
              <Helmet
                title={data.site.siteMetadata.title}
                meta={[
                  { name: 'description', content: 'Sample' },
                  { name: 'keywords', content: 'sample, something' },
                ]}
              />
              <Header
                background="background-image: linear-gradient(116deg, #08AEEA 0%, #2AF598 100%)"
                title={data.site.siteMetadata.title}
                {...auth}
              />
              <Container>
                { /* this is how we pass props to children prop */}
                { React.cloneElement(children, {...props, ...auth})}
              </Container>
            </div>
          )}
        />
      );
    }}
  </Auth>
);

TemplateWrapper.propTypes = {
  children: PropTypes.object,
  data: PropTypes.object,
};

export default TemplateWrapper;