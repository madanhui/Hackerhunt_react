import React, { Component } from "react";
import data from "../assets/topics.json";
import ApiList from "../common/apiList";
import TopicList from "../common/topicList";
import Subscribe from "../common/subscribe";
import { Link, withRouter } from "react-router-dom";

class PostContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      category: "popular"
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  fetchPosts = path => {
    let page = path === "/" ? "/pages/0" : path;
    fetch(`http://localhost:8000${page}`) //i have the proxy set to port 8000 in the package.json alredy
      .then(res => res.json())
      .then(res => this.setState({ posts: res.data }));
  };

  componentDidMount() {
    this.fetchPosts(this.props.location.pathname);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.fetchPosts(nextProps.location.pathname);
    }
  }

  onSelectChange(event) {
    let target = event.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    let name = target.name;
    this.setState({
      [name]: value
    });
  }

  renderTopics() {
    const list = data.map((items, index) => (
      <TopicList
        items={items}
        key={items.name}
        onTopicSelect={() => this.onTopicSelect.bind(this, items.value)}
      />
    ));
    return list;
  }

  onTopicSelect(name) {
    let destination = `/topic/${name.toLowerCase()}/trending/0`;
    this.props.history.push(destination);
  }

  renderContent = () => {
    if (!this.state.posts.length) {
      return <div className="loader" />; //becasue some of hackerhunt's api contains error.
    }

    const list = this.state.posts.map((items, index) => (
      <ApiList items={items} key={items.id} />
    ));
    return list;
  };

  renderPaginationButton() {
    let currentPath = this.props.location.pathname.split("/");
    let currentPageNumber = Number(currentPath[currentPath.length - 1]); //to isolate the number from the path
    let nextPage = currentPageNumber + 1;

    if (currentPath[1] && currentPath[1] !== "pages") {
      //becasue hackerhunt does not provide the api for this
      return (
        //so i have to handle the route between home content and the content located in a specific topic page
        <Link //in this this way
          className="btn btn-secondary content-view__previous"
          to={`/topic/${currentPath[2]}/trending/${nextPage}`}
        >
          Previous page
        </Link>
      );
    }
    return (
      <Link
        className="btn btn-secondary content-view__previous"
        to={`/pages/${nextPage}`}
      >
        Previous day
      </Link>
    );
  }

  render() {
    return (
      <div className="content">
        <nav className="sidebar">
          <h5 className="mb-2 text-muted">TOPICS</h5>
          <ul className="side-nav">{this.renderTopics()}</ul>
        </nav>
        <main className="content-view">
          <div className="content-header">
            <span className="mb-2 content-header__text">TODAY</span>
            <a href="" className="ml-auto content-view__item">
              <select
                name="category"
                className="mr-4 content-header__text"
                onChange={this.onSelectChange}
              >
                <option value="popular">POPULAR</option>
                <option value="newest">NEWEST</option>
                <option value="comment">COMMENT</option>
              </select>
            </a>
          </div>
          {this.renderContent()}
          <div className="content-view__pagination p-5">
            {this.renderPaginationButton()}
          </div>
        </main>
        <Subscribe />
        <div className="right-gap" />
      </div>
    );
  }
}

export default withRouter(PostContent);
