import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import calcRatio from '../helpers/calc';

const AnimatedImageLoad = styled.div`
  padding-bottom: ${props => `${props.imageRatio}%`};
  position: relative;
  display: block;
  height: 0;
  width: 100%;
  overflow: hidden;

  .ls-blur-up-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    font-family: "blur-up: always", "object-fit: cover";
    object-fit: cover;
    transform: scale(1.1);
    filter: blur(10px);
    opacity: 1;
    transition: transform 1500ms, opacity 1000ms, filter 1500ms;
  }

  .ls-blur-up-img.ls-inview.ls-original-loaded {
    opacity: 0;
    filter: blur(5px);
    transform: scale(1);
  }
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

const LazyLoadedImage = (props) => {
  const {
    urlT,
    tHeight,
    tWidth,
    urlN,
    nHeight,
    nWidth,
    urlO,
    oHeight,
    oWidth,
    alt,
  } = props;

  return (
    <AnimatedImageLoad imageRatio={calcRatio(tHeight, tWidth)}>
      <Image
        alt={alt}
        data-sizes="auto"
        data-lowsrc={urlT} // Default
        data-srcset={`
            ${urlN} ${nWidth}w ${nHeight}h,
            ${urlO} ${oWidth}w ${oHeight}h,
          `}
        className="lazyload lazyloadimage"
      />
      <noscript>
        <Image alt={alt} src={urlT} />
      </noscript>
    </AnimatedImageLoad>
  );
};

LazyLoadedImage.propTypes = {
  urlT: PropTypes.string.isRequired,
  tHeight: PropTypes.number.isRequired,
  tWidth: PropTypes.number.isRequired,
  urlN: PropTypes.string.isRequired,
  nHeight: PropTypes.number.isRequired,
  nWidth: PropTypes.number.isRequired,
  urlO: PropTypes.string.isRequired,
  oHeight: PropTypes.number.isRequired,
  oWidth: PropTypes.number.isRequired,
  alt: PropTypes.string.isRequired,
};

export default LazyLoadedImage;
