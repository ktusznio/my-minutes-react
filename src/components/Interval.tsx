import * as React from 'react';

export interface IIntervalProps {
  active: boolean;
}

interface IIntervalState {
  interval?: number;
}

const INTERVAL_DURATION = 1000;

const Interval = (component: typeof React.Component) => {
  return class extends component<any, any> {
    constructor(props) {
      super(props);
      this.state = {
        interval: null,
      };
    }

    componentWillMount() {
      this.createInterval(this.props);
    }

    componentWillReceiveProps(nextProps: IIntervalProps) {
      if (!this.state.interval && nextProps.active) {
        this.createInterval(nextProps);
      }

      if (!nextProps.active) {
        this.clearInterval();
      }
    }

    componentWillUnmount() {
      this.clearInterval();
    }

    createInterval(props: IIntervalProps) {
      if ((!this.state || !this.state.interval) && props.active) {
        const interval = setInterval(
          this.forceUpdate.bind(this),
          INTERVAL_DURATION
        );
        this.setState({ interval });
      }
    }

    clearInterval() {
      if (this.state.interval) {
        clearInterval(this.state.interval);
        this.setState({ interval: null });
      }
    }
  }
}

export default Interval;
