import * as React from 'react';

interface IMotivationQuoteProps {
  style: Object;
}

interface IMotivationQuoteState {
  quote: string;
}

export default class MotivationalQuote extends React.Component<IMotivationQuoteProps, IMotivationQuoteState> {
  constructor(props) {
    super(props);
    this.state = {
      quote: QUOTES[Math.floor(Math.random() * QUOTES.length)],
    };
  }

  render() {
    return (
      <div style={this.props.style}>
        {this.state.quote}
      </div>
    );
  }
}

const QUOTES = [
  // By men.
  '“No hour of life is lost that is spent in the saddle.” - Winston Churchill',
  '“Efficiency is doing things right; effectiveness is doing the right things.” - Peter Drucker',
  '“It is the working man who is the happy man. It is the idle man who is the miserable man.” - Benjamin Franklin',
  '“A goal is not always meant to be reached, it often serves simply as something to aim at.” - Bruce Lee',
  '“The path to success is to take massive, determined action.” - Tony Robbins',
  '“If you do what you’ve always done, you’ll get what you’ve always gotten.” - Tony Robbins',
  '“Great acts are made up of small deeds.” - Lao Tzu',
  '“Our greatest glory is not in never failing, but in rising up every time we fail.” - Ralph Waldo Emerson',
  '“There’s no abiding success without commitment.” - Tony Robbins',
  '“How am I going to live today in order to create the tomorrow I’m committed to?” - Tony Robbins',
  '“If you love life, don’t waste time, for time is what life is made up of.” - Bruce Lee',
  '“It’s not the daily increase but daily decrease. Hack away at the unessential.” - Bruce Lee',
  '“The best way to predict the future is to create it.” - Alan Kay',
  '“Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.” - Paul Meyer',
  '“If you don’t pay appropriate attention to what has your attention, it will take more of your attention than it deserves.” - Benjamin Franklin',
  '“Either write something worth reading or do something worth writing.” - Benjamin Franklin',
  '“Amateurs sit and wait for inspiration, the rest of us just get up and go to work.” - Stephen King',
  '“If you spend too much time thinking about a thing, you’ll never get it done.” - Bruce Lee',
  '“Action is the foundational key to all success.” - Pablo Picasso',
  '“While one person hesitates because he feels inferior, the other is busy making mistakes and becoming superior.” - Henry C. Link',
  '“Sometimes, things may not go your way, but the effort should be there every single night.” - Michael Jordan',
  '“He who is not courageous enough to take risks will accomplish nothing in life.” - Muhammad Ali',
  '“If you’re going through hell, keep going.” - Winston Churchill',

  // By women.
  '“If you don’t accept failure as a possibility, you don’t set high goals, you don’t branch out, you don’t try - you don’t take the risk.” - Rosalynn Carter',
  '“We are not interested in the possibilities of defeat; they do not exist.” - Queen Victoria',
  '“Doing the best at this moment puts you in the best place for the next moment.” - Oprah Winfrey',
  '“My best successes came on the heels of failures.” - Barbara Corcoran',
  '“We must believe that we are gifted for something, and that this thing, at whatever cost, must be attained.” - Marie Curie',
  '“Always go with the choice that scares you the most, because that’s the one that is going to require the most from you.” - Caroline Myss',
  '“In the end, hard work is the true, enduring characteristic of successful people.” - Caroline Myss',
  '“No one can make you feel inferior without your consent.” — Eleanor Roosevelt',
  '“The most effective way to do it, is to do it.” — Amelia Earhart',
  '“Destiny is a name often given in retrospect to choices that had dramatic consequences.” — J. K. Rowling',
  '“Never give up, for that is just the place and time that the tide will turn.” — Harriet Beecher Stowe',
];
