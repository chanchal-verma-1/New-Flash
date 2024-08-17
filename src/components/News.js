import React, { useEffect,useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props) => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  // document.title=`${capitalizeFirstLetter(props.category)}-NewsMonkey`;


  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
  const updateNews = async()=>{
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=f566def1bffe4f719de380a0ccff8e2f&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
 
    props.setProgress(100);
  }
  useEffect(() => {
    updateNews();
    /* eslint-disable */
  }, [])


 
  const fetchMoreData= async()=>{
    setPage(page +1)
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=f566def1bffe4f719de380a0ccff8e2f&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
    setLoading(false)
  };
  
    return (
      <>
        <h1 className="text-center " style={{marginTop:"90px", fontWeight:"bolder"}}> Welcome to News Buddy! </h1>
        <br></br>
        <h1 className="text-center " style={{ marginBottom:"30px", fontWeight:"bolder"}}> {capitalizeFirstLetter(props.category)} News for you</h1>

        {/* {loading && <Spinner />} */}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles !== totalResults}
          loader={loading && <Spinner/>}>
      <div className="container">    
        <div className="row">
          {articles.map((element,index) => {
              return (
                <div className="col-md-4" key={index}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 45) : " "}
                    description={element.description? element.description.slice(0, 88): " "}
                    newsUrl={element.url}
                    imgUrl={element.urlToImage}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name} />
                    </div> );
                    })}</div>

      </div>  
        </InfiniteScroll>
      </> 
    );
  
}
News.defaultProps = {
  country: "in",
  pageSize: 12,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};
export default News;
