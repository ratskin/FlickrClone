import React from 'react';

const withInfiniteScroll = Component => (
  class WithInfiniteScroll extends React.Component {
    componentDidMount() {
      // Document and window don't scroll, only the "#root > div" element does
      // Document is undefined in SSR
      this.node = typeof document !== 'undefined'
        ? document.querySelector('#root > div')
        : null;

      // Only check every 250ms, instead of on each scroll event
      this.interval = setInterval(this.handleScroll, 250);
    }

    componentWillUnmount() {
      clearInterval(this.interval);
    }

    infiniteScrollCondition = () => {
      const { feedData, isLoading, isError } = this.props;
      const fromBottom = (this.node.scrollHeight - this.node.offsetHeight) - this.node.scrollTop;
      return (
        (fromBottom <= this.node.offsetHeight * 2)
        && feedData.length
        && !isLoading
        && !isError
      );
    };

    handleScroll = () => {
      // If we're close to the bottom of the page, update feedData
      const { getNewData } = this.props;
      return this.infiniteScrollCondition() && getNewData();
    }

    render() {
      return <Component {...this.props} />;
    }
  }
);

export default withInfiniteScroll;
