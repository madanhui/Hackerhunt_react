import React from "react";

const Subscribe = () => {
  return (
    <div className="subscribe">
      <h4 className="font-weight-light">Get high on categorized</h4>
      <h4 className="font-weight-light">Show HN submissions.</h4>
      <p className="h5 mt-3">
        We know the struggle. A lot of great stuff on Hacker News gets lost in
        the shownew limbo.
      </p>
      <p className="h5 mt-3">Get the weekly top Show HN picks in your inbox!</p>
      <form className="subscribe__form mt-4">
        <div className="form-group">
          <input className="form-control" type="text" placeholder="Your e-mail" />
        </div>
        <button className="btn btn-block">Subscribe</button>
      </form>
      <p className="h5 mt-5">
        Proudly brought to you by{" "}
        <a className="text-muted" href="https://finch.io/">
          Finch.io
        </a>
      </p>
    </div>
  );
};

export default Subscribe;
