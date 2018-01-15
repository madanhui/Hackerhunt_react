import React, { Component } from "react";
import topics from "../assets/topics.json"; //categories list. just in case the app goes better,its more maintainable
import categories from "../assets/preferences.json"; //categories list. just in case the app goes better,its more maintainable
import ApiList from "../common/apiList";
import TopicList from "../common/topicList";
import Subscribe from "../common/subscribe";
import FilteredList from "../util/onPreference"; //utility function to filter list of posts.
import { Link, withRouter } from "react-router-dom";
import axios from "axios";

class PostContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      selectedCategory: "", //default value to handle select behavior
      showMore: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  fetchPosts = path => {
    let page = path === "/" ? "/pages/0" : path;
    axios
      .get(`${page}`) //i have the proxy set to port 8000 in the package.json alredy
      .then(res => this.setState({ posts: res.data.data }));
  };

  componentDidMount() {
    this.fetchPosts(this.props.location.pathname);
  }

  componentWillReceiveProps(nextProps) {
    //if the localtion changes
    let originPath = this.props.location.pathname.split("/");   //current page number
    let originPageNumber = Number(originPath[originPath.length - 1]); //to isolate the number from the path

    let nextPath=nextProps.location.pathname.split("/");   //updated page path
    let nextPageNumber = Number(nextPath[nextPath.length - 1]); //to isolate the number from the path
    
    if(originPageNumber!==nextPageNumber){    //only want this function to run if page number changes instead of the overall path.
      this.fetchPosts(nextProps.location.pathname); //this is to improve performance
    }
    //if (this.props.location.pathname !== nextProps.location.pathname) {
    //  this.fetchPosts(nextProps.location.pathname);   //this is also ok, but it slows down the performance of the website,and cause bugs.
    //}
  }

  handleInputChange(event) {
    //very slick here!
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  renderTopics() {
    return topics.map((items, index) =>
      <TopicList
        items={items}
        key={items.name}
        onTopicSelect={() => this.onTopicSelect.bind(this, items.value)}
      />
    )
  }

  renderOptions(){
    return categories.map((item,index)=>
    <option value={item.value}>{item.text}</option>
  )
}

  onTopicSelect(name) {
    let destination = `/topic/${name.toLowerCase()}/trending/0`;
    this.props.history.push(destination);
  }

  renderContent = () => {
    const { posts, selectedCategory, showMore } = this.state;
    if (!this.state.posts.length) {
      return <div className="loader" />; //becasue some of hackerhunt's api contains error.
    }
    return FilteredList(posts, selectedCategory, showMore); //render list of posts based on the user prefercence,
    //default is render by popularity
  };

  renderPaginationButton() {
    let currentPath = this.props.location.pathname.split("/");
    let currentPageNumber = Number(currentPath[currentPath.length - 1]); //to isolate the number from the path
    let nextPage = currentPageNumber + 1;

    if (currentPath[1] && currentPath[1] !== "pages") {
      //if the corrent path [1] is not pages, means we are dealing with a different Api route here
      //becasue hackerhunt does not provide the api for this
      return (
        //so i have to handle the route between home content and the content located in a specific topic page
        <Link //in this this way
          className="btn btn-secondary content-view__previous"
          to={`/topic/${currentPath[2]}/trending/${nextPage}`}
          onClick={() => this.setState({ showMore: false})}
        >
          Previous page
        </Link>
      );
    }
    return (
      <Link
        className="btn btn-secondary content-view__previous"
        to={`/pages/${nextPage}`}
        onClick={() => this.setState({ showMore: false})}
      >
        Previous day
      </Link>
    );
  }

  render() {
    let currentPath = this.props.location.pathname.split("/");
    console.log(currentPath);
    return (
      <div className="content">
        <nav className="sidebar">
          <h5 className="mb-2 text-muted">TOPICS</h5>
          <ul className="side-nav">{this.renderTopics()}</ul>
        </nav>
        <main className="content-view">
          <div className="content-header">
            <span className="mb-2 content-header__text">TODAY</span>
            <div className="ml-auto content-view__item">
              <select
                name="selectedCategory"
                className="mr-4 content-header__text"
                onChange={this.handleInputChange}
              >
                {this.renderOptions()}
              </select>
            </div>
          </div>
          {this.renderContent()}
          <div className="content-view__pagination p-5">
            <a
              className="btn btn-secondary content-view__previous mr-2"
              onClick={() => this.setState({ showMore: true })}
            >
              Show more
            </a>
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
